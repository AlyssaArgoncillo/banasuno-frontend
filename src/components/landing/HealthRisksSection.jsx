import '../../styles/HealthRisksSection.css';

function HealthRisksSection() {
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
          {healthRisks.map((risk, index) => (
            <div key={index} className={`card ${risk.colorClass}`}>
              <div className="overlay"></div>
              <div className="circle">
                <img src={risk.icon} alt={risk.title} className="icon" />
              </div>
              <p className="card-title">{risk.title}</p>
              <p className="card-description">{risk.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HealthRisksSection;
