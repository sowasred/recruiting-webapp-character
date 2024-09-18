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

  // Function to check if the req are met
  const checkRequirements = (classInfo) => {
    return ATTRIBUTE_LIST.every(attr => attributes[attr] >= classInfo[attr]);
  };

  const [selectedClass, setSelectedClass] = useState(null);

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
      <section className="App-section">
        <h2>Classes</h2>
        {Object.keys(CLASS_LIST).map((className) => {
          const classInfo = CLASS_LIST[className];
          const isReqMet = checkRequirements(classInfo);
          return (
            <div 
              key={className} 
              style={{ color: isReqMet ? 'green' : 'red', cursor: 'pointer' }}
              onClick={() => setSelectedClass(className)}
            >
              <h3>{className}</h3>
              {selectedClass === className && (
                <div>
                  {Object.entries(classInfo).map(([attr, value]) => (
                    <div key={attr}>
                      {attr}: {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </section>
    </div>
  );
}

export default App;
