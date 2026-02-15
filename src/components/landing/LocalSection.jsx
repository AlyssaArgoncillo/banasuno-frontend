import '../../styles/LocalSection.css';

function LocalSection() {
  return (
    <section className="local-section">
      <div className="local-container">
        <h3 className="local-heading">Why Davao City?</h3>
        <div className="local-card">
          <div className="local-content">
            <p className="local-description">
              Davao City is the perfect case study because it's one of the fastest-urbanizing cities in the Philippines, experiencing significant heat island effects that put its growing population at risk. With its tropical climate, dense urban development, and limited green spaces, the city faces increasing heat-related health challenges that need immediate attention. By starting with Davao, we can demonstrate how our tool works in a real Philippine city context before expanding to other urban centers nationwide.
            </p>
          </div>
          <div className="local-image">
            <img src="/risk1.jpg" alt="Davao City" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LocalSection;
