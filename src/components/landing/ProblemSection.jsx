import '../../styles/ProblemSection.css';

function ProblemSection() {
  return (
    <section className="problem-section">
      <div className="problem-container">
        <div className="problem-intro">
          <h2>What is BanasUno Aiming to Solve?</h2>
          <p>
            Cities are getting hotter, and rising urban temperatures create serious health and 
            safety risks for residents. This section highlights the causes, the populations most affected.
          </p>
        </div>
        
        <div className="problem-detail">
          <h3>The Urban Heat Island Effect</h3>
          <p>
            Cities trap heat. Concrete, asphalt, dense buildings, and limited green spaces 
            cause urban areas to be significantly hotter than surrounding rural locations - 
            a phenomenon known as the Urban Heat Island (UHI) effect. As cities grow, this 
            heat buildup becomes more intense and more frequent.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
