// lib/ingredients.js

export const INGREDIENTS = {
  baseSpirits: [
    'Vodka',
    'Gin',
    'Rum (White)',
    'Rum (Dark)',
    'Rum (Spiced)',
    'Tequila (Blanco)',
    'Tequila (Reposado)',
    'Tequila (Añejo)',
    'Whiskey (Bourbon)',
    'Whiskey (Rye)',
    'Whiskey (Scotch)',
    'Whiskey (Irish)',
    'Brandy',
    'Cognac',
    'Mezcal',
    'Cachaça',
    'Nonalcoholic'
  ],
  
  liqueurs: [
    'Triple Sec',
    'Cointreau',
    'Grand Marnier',
    'Amaretto',
    'Kahlúa',
    'Baileys',
    'Chambord',
    'St-Germain',
    'Aperol',
    'Campari',
    'Chartreuse (Green)',
    'Chartreuse (Yellow)',
    'Drambuie',
    'Frangelico',
    'Galliano',
    'Goldschläger',
    'Jägermeister',
    'Limoncello',
    'Maraschino Liqueur',
    'Midori',
    'Sambuca',
    'Schnapps (Peach)',
    'Southern Comfort',
    'Crème de Cacao',
    'Crème de Menthe',
    'Crème de Cassis',
    'Blue Curaçao',
    'Benedictine',
    'Disaronno'
  ],
  
  mixers: [
    'Tonic Water',
    'Club Soda',
    'Ginger Beer',
    'Ginger Ale',
    'Cola',
    'Sprite/7UP',
    'Simple Syrup',
    'Grenadine',
    'Honey Syrup',
    'Agave Nectar',
    'Maple Syrup',
    'Coconut Cream',
    'Heavy Cream',
    'Egg White',
    'Rose Water',
    'Orange Blossom Water',
    'Mint Leaves',
    'Basil Leaves',
    'Rosemary',
    'Thyme',
    'Salt',
    'Sugar',
    'Brown Sugar',
    'Superfine Sugar'
  ],
  
  bitters: [
    'Angostura Bitters',
    'Orange Bitters',
    'Peychaud\'s Bitters',
    'Walnut Bitters',
    'Chocolate Bitters',
    'Cherry Bitters',
    'Lavender Bitters',
    'Cardamom Bitters',
    'Regan\'s Orange Bitters',
    'Fee Brothers Bitters'
  ],
  
  juices: [
    'Lime Juice',
    'Lemon Juice',
    'Orange Juice',
    'Grapefruit Juice',
    'Cranberry Juice',
    'Pineapple Juice',
    'Apple Juice',
    'Pomegranate Juice',
    'Tomato Juice',
    'Ginger Juice',
    'Watermelon Juice',
    'Blood Orange Juice',
    'Ruby Red Grapefruit Juice'
  ]
};

export const TASTE_PREFERENCES = [
  'boozy',
  'sweet', 
  'fruity',
  'refreshing',
  'no preference'
];

export const DRINK_STYLES = [
  'classic',
  'creative', 
  'no preference'
];

// Helper function to get all selected ingredients as a formatted string
export const formatSelectedIngredients = (selections) => {
  const categories = Object.keys(INGREDIENTS);
  let formatted = '';
  
  categories.forEach(category => {
    const selected = selections[category] || [];
    if (selected.length > 0) {
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
      formatted += `${categoryName}: ${selected.join(', ')}\n`;
    }
  });
  
  if (selections.other && selections.other.trim()) {
    formatted += `Other: ${selections.other}\n`;
  }
  
  return formatted;
};

// Helper function to build the Claude prompt
export const buildPrompt = (selections, preferences, requestType) => {
  const ingredientsText = formatSelectedIngredients(selections);
  const tasteText = preferences.taste || 'no preference';
  const styleText = preferences.style || 'no preference';
  const commentary = preferences.commentary?.trim() || '';
  
  const requestText = requestType === 'menu' 
    ? 'Create a 3-drink party menu with diverse liquor usage'
    : 'Create 3-5 individual cocktail recipes';
  
  return `You are an expert bartender. Based on the available ingredients and preferences below, create ${requestType === 'menu' ? 'a party menu' : 'recipes'} that utilize these ingredients effectively.

AVAILABLE INGREDIENTS:
${ingredientsText}

PREFERENCES:
Taste: ${tasteText}
Style: ${styleText}
${commentary ? `Commentary: ${commentary}` : ''}

REQUEST: ${requestText}

For each drink, provide:
- Name
- Ingredients with measurements
- Instructions
- Brief description of taste profile

Keep recipes practical and achievable with standard bar tools.${requestType === 'menu' ? ' For the party menu, try to use different base spirits for each drink when possible.' : ''}`;
};