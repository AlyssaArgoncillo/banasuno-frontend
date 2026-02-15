import { useState } from 'react';
import { useSpring, animated, to } from '@react-spring/web';
import '../styles/HealthRisksSection.css';

function HealthCard({ image, title, description }) {
  const [picked, setPicked] = useState(false);
  const { rotateY, y } = useSpring({
    rotateY: picked ? 180 : 0,
    y: picked ? -50 : 0,
    config: { mass: 5, tension: 300, friction: 100 },
  });

  return (
    <div className="health-card" onClick={() => setPicked(state => !state)}>
      <animated.div
        className="card-front"
        style={{
          transform: to([rotateY, y], (rot, yVal) => 
            `perspective(1000px) rotateY(${rot}deg) translateY(${yVal}px)`
          ),
          boxShadow: y.to((yVal) => 
            `0 ${Math.abs(yVal) * 0.4}px ${Math.abs(yVal) * 0.8}px rgba(255, 107, 26, ${Math.abs(yVal) * 0.008})`
          ),
        }}
      >
        <img src={image} alt={title} className="card-image" />
        <h3 className="card-title">{title}</h3>
      </animated.div>
      <animated.div
        className="card-back"
        style={{
          transform: to([rotateY, y], (rot, yVal) => 
            `perspective(1000px) rotateY(${rot + 180}deg) translateY(${yVal}px)`
          ),
          boxShadow: y.to((yVal) => 
            `0 ${Math.abs(yVal) * 0.4}px ${Math.abs(yVal) * 0.8}px rgba(255, 107, 26, ${Math.abs(yVal) * 0.008})`
          ),
        }}
      >
        <p className="card-description">{description}</p>
      </animated.div>
    </div>
  );
}

function HealthRisksSection() {
  const healthRisks = [
    {
      image: '/risk1.jpg',
      title: 'Heat Exhaustion',
      description: 'Excessive heat can lead to heat exhaustion, causing dizziness, nausea, and weakness.'
    },
    {
      image: '/risk1.jpg',
      title: 'Cardiovascular Strain',
      description: 'High temperatures put extra stress on the heart and can worsen existing conditions.'
    },
    {
      image: '/risk1.jpg',
      title: 'Dehydration',
      description: 'Increased sweating and heat exposure can lead to severe dehydration if fluids aren\'t replaced.'
    }
  ];

  return (
    <section className="health-risks-section">
      <div className="health-risks-container">
        <h2 className="health-risks-heading">Possible Health Risks</h2>
        <div className="health-risks-cards">
          {healthRisks.map((risk, index) => (
            <HealthCard
              key={index}
              image={risk.image}
              title={risk.title}
              description={risk.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HealthRisksSection;
