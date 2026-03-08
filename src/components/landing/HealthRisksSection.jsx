import { useState } from 'react';
import '../../styles/HealthRisksSection.css';

function HealthRisksSection() {
  const [expandedCards, setExpandedCards] = useState(new Set());
  const toggleCard = (index) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };
  const healthRisks = [
    {
      title: 'Heat Exhaustion',
      colorClass: 'heat-exhaustion',
      icon: '/thermo.png',
      description: 'Excessive heat can lead to heat exhaustion, causing dizziness, nausea, weakness, and heavy sweating. If untreated, it can progress to heat stroke.'
    },
    {
      title: 'Cardiovascular Strain',
      colorClass: 'cardiovascular',
      icon: '/heart.png',
      description: 'High temperatures put extra stress on the heart and can worsen existing cardiovascular conditions, increasing risk of heart attacks and strokes.'
    },
    {
      title: 'Dehydration',
      colorClass: 'dehydration',
      icon: '/drop.png',
      description: 'Increased sweating and heat exposure can lead to severe dehydration if fluids aren\'t replaced, affecting kidney function and overall health.'
    }
  ];

  return (
    <section className="health-risks-section">
      <div className="health-risks-container">
        <h2 className="health-risks-heading">Possible Health Risks</h2>
        <div className="health-risks-cards">
          {healthRisks.map((risk, index) => {
            const isExpanded = expandedCards.has(index);
            return (
              <div
                key={index}
                className={`card ${risk.colorClass}${isExpanded ? ' card-expanded' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleCard(index); }}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    ev.stopPropagation();
                    toggleCard(index);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? `Collapse ${risk.title}` : `Expand ${risk.title}`}
              >
                <div className="overlay" aria-hidden />
                <div className="circle">
                  <img src={risk.icon} alt="" className="icon" />
                </div>
                <p className="card-title">{risk.title}</p>
                <p className="card-description">{risk.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HealthRisksSection;
