import { TASTE_PREFERENCES, DRINK_STYLES } from '../lib/ingredients';

export default function PreferenceSelector({ preferences, onPreferenceChange }) {
  
  const handleTasteChange = (taste) => {
    const newTaste = preferences.taste === taste ? '' : taste;
    onPreferenceChange('taste', newTaste);
  };

  const handleStyleChange = (style) => {
    const newStyle = preferences.style === style ? '' : style;
    onPreferenceChange('style', newStyle);
  };

  const handleCommentaryChange = (e) => {
    onPreferenceChange('commentary', e.target.value);
  };

  return (
    <div className="section">
      <h2>Preferences</h2>
      
      <div>
        <h3>Taste Preference</h3>
        <div className="ingredient-grid">
          {TASTE_PREFERENCES.map(taste => (
            <button
              key={taste}
              onClick={() => handleTasteChange(taste)}
              className={`toggle-button ${preferences.taste === taste ? 'active' : ''}`}
            >
              {taste}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Drink Style</h3>
        <div className="ingredient-grid">
          {DRINK_STYLES.map(style => (
            <button
              key={style}
              onClick={() => handleStyleChange(style)}
              className={`toggle-button ${preferences.style === style ? 'active' : ''}`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3>Additional Notes</h3>
        <textarea
          value={preferences.commentary || ''}
          onChange={handleCommentaryChange}
          placeholder="Any additional preferences or notes for your bartender..."
          className="text-input"
          rows={3}
        />
      </div>
    </div>
  );
}