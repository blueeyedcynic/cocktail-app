export default function ResultsDisplay({ results }) {
  
  const parseAndFormatResults = (text) => {
    const lines = text.split('\n');
    let formattedContent = [];
    let currentSection = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line === '') {
        if (currentSection.length > 0) {
          formattedContent.push(currentSection);
          currentSection = [];
        }
      } else {
        currentSection.push(line);
      }
    }
    
    // Add the last section if it exists
    if (currentSection.length > 0) {
      formattedContent.push(currentSection);
    }
    
    return formattedContent;
  };

  const extractRecipeForSharing = (section) => {
    let recipeName = '';
    let recipeContent = [];
    
    for (const line of section) {
      if (line.startsWith('## ')) {
        // Extract recipe name
        recipeName = line.replace(/^## /, '').replace(/\*\*(.*?)\*\*/g, '$1');
      } else if (line.startsWith('# ')) {
        // Skip menu titles
        continue;
      } else if (line.trim() && !line.startsWith('###')) {
        // Add content lines (skip empty lines and sub-headers)
        recipeContent.push(line.replace(/\*\*(.*?)\*\*/g, '$1')); // Remove bold formatting
      }
    }
    
    return { recipeName, recipeContent };
  };

  const shareRecipe = (section) => {
    const { recipeName, recipeContent } = extractRecipeForSharing(section);
    
    if (!recipeName) return;
    
    // Create the message text
    let messageText = recipeName;
    
    if (recipeContent.length > 0) {
      messageText += '\n\n' + recipeContent.join('\n');
    }
    
    messageText += '\n\nShared from Cocktail Discovery App';
    
    // Check if we're on mobile and the Web Share API is available
    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      navigator.share({
        title: recipeName,
        text: messageText
      }).catch(err => {
        console.log('Web Share failed, falling back to SMS:', err);
        // Fallback to SMS if Web Share fails
        fallbackToSMS(messageText);
      });
    } else {
      // Fallback to SMS
      fallbackToSMS(messageText);
    }
  };

  const fallbackToSMS = (messageText) => {
    // Try to keep message under SMS limits (160 chars per SMS, but most phones handle longer)
    // If message is very long, truncate it
    if (messageText.length > 1000) {
      const lines = messageText.split('\n');
      let truncatedMessage = lines[0]; // Recipe name
      let charCount = truncatedMessage.length;
      
      for (let i = 1; i < lines.length; i++) {
        if (charCount + lines[i].length + 1 < 900) { // Leave room for footer
          truncatedMessage += '\n' + lines[i];
          charCount += lines[i].length + 1;
        } else {
          truncatedMessage += '\n... (truncated)';
          break;
        }
      }
      
      truncatedMessage += '\n\nShared from Cocktail Discovery App';
      messageText = truncatedMessage;
    }
    
    // Encode the message for URL - be more careful with encoding
    const encodedMessage = encodeURIComponent(messageText);
    
    console.log('Final encoded message length:', encodedMessage.length);
    
    // Try different SMS URL formats based on device
    const userAgent = navigator.userAgent;
    let smsLink;
    
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      // iOS format
      smsLink = `sms:&body=${encodedMessage}`;
    } else if (/Android/i.test(userAgent)) {
      // Android format
      smsLink = `sms:?body=${encodedMessage}`;
    } else {
      // Generic format
      smsLink = `sms:?body=${encodedMessage}`;
    }
    
    console.log('SMS link:', smsLink);
    
    // Open the SMS app
    window.location.href = smsLink;
  };

  const formatLine = (line) => {
    // Handle markdown-style formatting
    if (line.startsWith('# ')) {
      // Main title (e.g., "# Creative Party Menu")
      return (
        <h1 className="menu-title">
          {line.replace(/^# /, '')}
        </h1>
      );
    }
    
    if (line.startsWith('## ')) {
      // Drink titles (e.g., "## 1. **Emerald Isle Fizz**")
      let title = line.replace(/^## /, '');
      // Remove markdown bold formatting
      title = title.replace(/\*\*(.*?)\*\*/g, '$1');
      return (
        <h2 className="drink-title">
          {title}
        </h2>
      );
    }
    
    if (line.startsWith('### ')) {
      // Sub headers
      return (
        <h3 style={{fontSize: '1.25rem', color: '#ffffff', margin: '1rem 0 0.5rem 0'}}>
          {line.replace(/^### /, '')}
        </h3>
      );
    }
    
    // Handle bold text in regular lines
    if (line.includes('**')) {
      const parts = line.split(/(\*\*.*?\*\*)/);
      return (
        <div style={{marginBottom: '0.5rem'}}>
          {parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={index} style={{color: '#ffffff'}}>
                  {part.replace(/\*\*/g, '')}
                </strong>
              );
            }
            return part;
          })}
        </div>
      );
    }
    
    // Regular line
    return (
      <div style={{marginBottom: '0.5rem'}}>
        {line}
      </div>
    );
  };

  const isRecipeSection = (section) => {
    return section.some(line => line.startsWith('## '));
  };

  const sections = parseAndFormatResults(results);

  return (
    <div className="results">
      <div>
        {sections.map((section, sectionIndex) => {
          // Check if this is a recipe/drink section
          const hasTitle = section.some(line => 
            line.startsWith('## ') || 
            line.startsWith('# ') ||
            (section.length > 1 && !line.startsWith('-') && !line.includes(':'))
          );
          
          if (hasTitle) {
            return (
              <div key={sectionIndex} className="recipe-card">
                <div className="recipe-content">
                  {section.map((line, lineIndex) => (
                    <div key={lineIndex}>
                      {formatLine(line)}
                    </div>
                  ))}
                </div>
                {/* Add share button only for individual recipes */}
                {isRecipeSection(section) && (
                  <button 
                    className="share-button"
                    onClick={() => shareRecipe(section)}
                  >
                    📱 Share Recipe
                  </button>
                )}
              </div>
            );
          } else {
            // Handle standalone sections (like menu titles)
            return (
              <div key={sectionIndex}>
                {section.map((line, lineIndex) => (
                  <div key={lineIndex}>
                    {formatLine(line)}
                  </div>
                ))}
              </div>
            );
          }
        })}
      </div>
      
      {sections.length === 0 && (
        <div style={{textAlign: 'center', color: '#888'}}>
          <p>No results to display. Please try again.</p>
        </div>
      )}
    </div>
  );
}