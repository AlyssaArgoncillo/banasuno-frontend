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
      <table className="planners-table">
        <thead>
          <tr>
            <th>Need:</th>
            <th>We Provide:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{need}</td>
            <td>{provide}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default CityPlannersSection;
