import { useState } from 'react';
import '../../styles/HeatSafety.css';

function HeatSafety() {
  const [followStates, setFollowStates] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const handleButtonClick = (index) => {
    setFollowStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const cards = [
    {
      title: 'Early Warning',
      description: 'Real-time heat alerts for high-risk areas.'
    },
    {
      title: 'Community Support',
      description: 'Connect with local resources and cooling centers.'
    },
    {
      title: 'Health Protection',
      description: 'Find healthcare facilities and emergency services nearby.'
    },
    {
      title: 'Risk Knowledge',
      description: 'Understand your neighborhood heat vulnerability.'
    }
  ];

  return (
    <section id="heat-safety" className="heat-safety-section">
      <h1 className="heat-safety-title">STAY SAFE IN THIS HEAT</h1>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div key={index} className="card">
            <img src="/risk1.jpg" alt={card.title} />
            <section>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <div>
                <button
                  onClick={() => handleButtonClick(index)}
                  className={followStates[index] ? 'following' : ''}
                >
                  {followStates[index] ? 'Following' : 'Learn'}
                </button>
              </div>
            </section>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HeatSafety;
