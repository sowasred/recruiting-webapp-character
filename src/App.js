import { useState, useEffect } from 'react';
import './App.css';
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from './consts.js';

function App() {
  const [num, setNum] = useState(0);
  // Create state for each attribute
  const [attributes, setAttributes] = useState(
    Object.fromEntries(ATTRIBUTE_LIST.map(attr => [attr, num]))
  );

  const [skills, setSkills] = useState(
    Object.fromEntries(SKILL_LIST.map(skill => [skill.name, 0]))
  );

  const [skillPoints, setSkillPoints] = useState(0);

  useEffect(() => {
    const intelligenceModifier = calculateModifier(attributes.Intelligence);
    const newSkillPoints = 10 + (4 * intelligenceModifier);
    
    if (newSkillPoints < skillPoints) {
      const pointsToRemove = skillPoints - newSkillPoints;
      removeExcessSkillPoints(pointsToRemove);
    }
    
    setSkillPoints(newSkillPoints);
  }, [attributes.Intelligence]);

  const removeExcessSkillPoints = (pointsToRemove) => {
    setSkills(prev => {
      let updatedSkills = {...prev};
      let remainingToRemove = pointsToRemove;
      
      while (remainingToRemove > 0) {
        let removed = false;
        for (let skill of SKILL_LIST) {
          if (updatedSkills[skill.name] > 0) {
            updatedSkills[skill.name]--;
            remainingToRemove--;
            removed = true;
            break;
          }
        }
        if (!removed) break; // No more skills with points to remove
      }
      
      return updatedSkills;
    });
  };

  // Function to update attribute values
  const updateAttribute = (attr, change) => {
    setAttributes(prev => {
      const newValue = Math.max(0, prev[attr] + change);
      if (newValue !== prev[attr]) {
        setNum(prevNum => prevNum + change);
        
        // Only adjust skill points if Intelligence is changed
        if (attr === 'Intelligence') {
          const newIntelligenceModifier = calculateModifier(newValue);
          const newSkillPoints = 10 + (4 * newIntelligenceModifier);
          setSkillPoints(newSkillPoints);
          
          if (newSkillPoints < skillPoints) {
            const pointsToRemove = skillPoints - newSkillPoints;
            removeExcessSkillPoints(pointsToRemove);
          }
        }
      }
      return {
        ...prev,
        [attr]: newValue
      };
    });
  };

  // Function to check if the req are met
  const checkRequirements = (classInfo) => {
    return ATTRIBUTE_LIST.every(attr => attributes[attr] >= classInfo[attr]);
  };

  const [selectedClass, setSelectedClass] = useState(null);

  // Function to calculate ability modifier
  const calculateModifier = (attributeValue) => {
    return Math.floor((attributeValue - 10) / 2);
  };

  const updateSkill = (skillName, change) => {
    const newSkillValue = Math.max(0, skills[skillName] + change);
    const currentTotalPoints = Object.values(skills).reduce((sum, val) => sum + val, 0);
    const availablePoints = skillPoints - currentTotalPoints;
    
    if ((change > 0 && availablePoints > 0) || (change < 0 && skills[skillName] > 0)) {
      setSkills(prev => ({
        ...prev,
        [skillName]: newSkillValue
      }));
    }
  };

  const calculateTotalSkillValue = (skill) => {
    const attributeModifier = calculateModifier(attributes[skill.attributeModifier]);
    return skills[skill.name] + attributeModifier;
  };

  const availableSkillPoints = Math.max(0, skillPoints - Object.values(skills).reduce((sum, val) => sum + val, 0));

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
            <span> Modifier: {calculateModifier(attributes[attr])}</span>
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
      <section className="App-section">
        <h2>Skills</h2>
        <div>Skill Points Available: {availableSkillPoints}</div>
        {SKILL_LIST.map(skill => (
          <div key={skill.name}>
            {skill.name} - points: {skills[skill.name]} 
            <button onClick={() => updateSkill(skill.name, 1)} disabled={availableSkillPoints === 0}>+</button>
            <button onClick={() => updateSkill(skill.name, -1)} disabled={skills[skill.name] === 0}>-</button>
            modifier ({skill.attributeModifier}): {calculateModifier(attributes[skill.attributeModifier])} {' '}
            total: {calculateTotalSkillValue(skill)}
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;
