'use client';

import { useState } from 'react';
import IngredientSelector from '../components/IngredientSelector';
import PreferenceSelector from '../components/PreferenceSelector';
import LoadingModal from '../components/LoadingModal';
import ResultsDisplay from '../components/ResultsDisplay';

export default function Home() {
  const [selectedIngredients, setSelectedIngredients] = useState({
    baseSpirits: [],
    liqueurs: [],
    mixers: [],
    bitters: [],
    juices: [],
    other: ''
  });

  const [preferences, setPreferences] = useState({
    taste: '',
    style: '',
    commentary: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleIngredientChange = (category, value) => {
    setSelectedIngredients(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateCocktails = async (type) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/generate-cocktails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          preferences: preferences,
          requestType: type
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate cocktails');
      }

      const data = await response.json();
      setResults(data.response);
    } catch (error) {
      console.error('Error generating cocktails:', error);
      setError('The bartender stepped outside for a moment, please try again in a few minutes.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasAnyIngredients = () => {
    return Object.values(selectedIngredients).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.trim().length > 0;
    });
  };

  const resetApp = () => {
    setResults(null);
    setError(null);
  };

  if (results || error) {
    return (
      <div className="container">
        {error ? (
          <div>
            <div style={{
              backgroundColor: '#8b0000', 
              border: '1px solid #ff0000', 
              padding: '1.5rem', 
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <p>{error}</p>
            </div>
            <button onClick={resetApp} className="back-button">
              Try Again
            </button>
          </div>
        ) : (
          <div>
            <ResultsDisplay results={results} />
            <button onClick={resetApp} className="back-button">
              ← Back - Create More Cocktails
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="header">
          <h1>Cocktail Discovery</h1>
          <p>Tell us what you have, we'll tell you what to make</p>
        </div>
        
        <IngredientSelector 
          selectedIngredients={selectedIngredients}
          onIngredientChange={handleIngredientChange}
        />
        
        <PreferenceSelector 
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
        />
        
        <div className="section">
          <h2>What would you like to create?</h2>
          <div className="generate-buttons">
            <button
              onClick={() => generateCocktails('recipes')}
              disabled={!hasAnyIngredients()}
              className="generate-button"
            >
              <div>
                <div style={{marginBottom: '0.5rem'}}>Create Some Recipes</div>
                <div style={{fontSize: '0.875rem', opacity: 0.8}}>Get 3-5 individual cocktail recipes</div>
              </div>
            </button>
            
            <button
              onClick={() => generateCocktails('menu')}
              disabled={!hasAnyIngredients()}
              className="generate-button"
            >
              <div>
                <div style={{marginBottom: '0.5rem'}}>Create a 3 Drink Menu</div>
                <div style={{fontSize: '0.875rem', opacity: 0.8}}>Perfect for hosting a party</div>
              </div>
            </button>
          </div>
          
          {!hasAnyIngredients() && (
            <p style={{textAlign: 'center', color: '#888', marginTop: '1rem', fontSize: '0.875rem'}}>
              Please select at least one ingredient to continue
            </p>
          )}
        </div>
      </div>

      {isLoading && <LoadingModal />}
    </>
  );
}