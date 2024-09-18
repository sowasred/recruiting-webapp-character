import { useState } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';

function App() {
  const [num, setNum] = useState(0);
  // Create state for each attribute
  const [attributes, setAttributes] = useState(
    Object.fromEntries(ATTRIBUTE_LIST.map(attr => [attr, num]))
  );

  // Function to update attribute values
  const updateAttribute = (attr, change) => {
    setAttributes(prev => ({
      ...prev,
      [attr]: Math.max(0, prev[attr] + change)
    }));
    setNum(prevNum => prevNum + change);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <section className="App-section">
        <div>Total Points: {num}</div>
        {ATTRIBUTE_LIST.map(attr => (
          <div key={attr}>
            {attr}: {attributes[attr]}
            <button onClick={() => updateAttribute(attr, 1)}>+</button>
            <button onClick={() => updateAttribute(attr, -1)}>-</button>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
