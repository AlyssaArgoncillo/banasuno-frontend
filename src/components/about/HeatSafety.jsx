import { useState } from 'react';
import '../../styles/HeatSafety.css';

function HeatSafety() {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (index) => {
    setExpandedCard((prev) => {
      const next = prev === index ? null : index;
      if (next === null && document.activeElement?.closest?.('.heat-safety-section .card')) {
        document.activeElement?.blur?.();
      }
      return next;
    });
  };

  const cards = [
    {
      title: 'Hydrate',
      image: '/hydrate.png',
      description: [
        'Drink water regularly, even if not thirsty.',
        'Avoid alcohol and caffeine.',
        'Carry a water bottle outdoors.'
      ]
    },
    {
      title: 'Seek Shade',
      image: '/shade.png',
      description: [
        'Avoid peak sun hours (12-3 PM).',
        'Stay in air-conditioned spaces.',
        'Use umbrellas or hats when outside.'
      ]
    },
    {
      title: 'Dress Light',
      image: '/run.png',
      description: [
        'Wear loose, breathable clothing.',
        'Choose light colors.',
        'Use sunscreen SPF 30+.'
      ]
    },
    {
      title: 'When To Get Help',
      image: '/dizzy.png',
      description: 'Seek medical attention immediately if experiencing: dizziness, confusion, rapid heartbeat, nausea, headache, or hot dry skin.'
    }
  ];

  return (
    <section id="heat-safety" className="heat-safety-section">
      <h1 className="heat-safety-title">STAY SAFE IN THIS HEAT</h1>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card${expandedCard === index ? ' expanded' : ''}`}
            onClick={() => handleCardClick(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(index);
              }
            }}
            role="button"
            tabIndex={0}
            aria-expanded={expandedCard === index}
            aria-label={`${card.title}, click to ${expandedCard === index ? 'collapse' : 'expand'} tips`}
          >
            <img src={card.image} alt="" />
            <section>
              <h2>{card.title}</h2>
              {Array.isArray(card.description) ? (
                <ul>
                  {card.description.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{card.description}</p>
              )}
            </section>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HeatSafety;
