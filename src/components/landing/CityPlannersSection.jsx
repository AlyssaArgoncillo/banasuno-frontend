import '../../styles/CityPlannersSection.css';

function CityPlannersSection({
  title = 'City Planners',
  need = 'Identify heat hotspots for urban interventions and green space planning.',
  provide = 'Interactive heat maps, risk scores, historical data, CSV exports.',
  imageSrc = '/CityHall2.png',
  imageAlt = 'City Hall'
}) {
  return (
    <section className="city-planners-section">
      <div className="city-planners-image-section">
        <div className="outer-rectangle">
          <div className="inner-rectangle"></div>
          <img src={imageSrc} alt={imageAlt} className="city-hall-image" />
        </div>
      </div>
      <h2 className="city-planners-title">{title}</h2>
      <div className="planners-cards">
        <div className="planners-card planners-need">
          <div className="planners-card-label">Need</div>
          <p className="planners-card-text">{need}</p>
        </div>
        <div className="planners-card planners-provide">
          <div className="planners-card-label">We Provide</div>
          <p className="planners-card-text">{provide}</p>
        </div>
      </div>
    </section>
  );
}

export default CityPlannersSection;
