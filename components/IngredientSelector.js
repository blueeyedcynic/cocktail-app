import { INGREDIENTS } from '../lib/ingredients';

export default function IngredientSelector({ selectedIngredients, onIngredientChange }) {
  
  const toggleIngredient = (category, ingredient) => {
    const currentSelection = selectedIngredients[category] || [];
    const newSelection = currentSelection.includes(ingredient)
      ? currentSelection.filter(item => item !== ingredient)
      : [...currentSelection, ingredient];
    
    onIngredientChange(category, newSelection);
  };

  const handleOtherChange = (e) => {
    onIngredientChange('other', e.target.value);
  };

  const isSelected = (category, ingredient) => {
    return (selectedIngredients[category] || []).includes(ingredient);
  };

  const renderCategory = (categoryKey, categoryName) => {
    return (
      <div className="section" key={categoryKey}>
        <h3>{categoryName}</h3>
        <div className="ingredient-grid">
          {INGREDIENTS[categoryKey].map(ingredient => (
            <button
              key={ingredient}
              onClick={() => toggleIngredient(categoryKey, ingredient)}
              className={`toggle-button ${isSelected(categoryKey, ingredient) ? 'active' : ''}`}
            >
              {ingredient}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="section">
      <h2>What ingredients do you have?</h2>
      
      {renderCategory('baseSpirits', 'Base Spirits')}
      {renderCategory('liqueurs', 'Liqueurs')}
      {renderCategory('mixers', 'Mixers')}
      {renderCategory('bitters', 'Bitters')}
      {renderCategory('juices', 'Juices')}
      
      <div className="section">
        <h3>Other Ingredients</h3>
        <textarea
          value={selectedIngredients.other || ''}
          onChange={handleOtherChange}
          placeholder="List any other ingredients you have (e.g., cucumber, jalapeño, maple syrup...)"
          className="text-input"
          rows={3}
        />
      </div>
    </div>
  );
}