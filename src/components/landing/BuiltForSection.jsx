import '../../styles/BuiltForSection.css';

const personas = [
  {
    id: 1,
    title: "Neighborhood Volunteers",
    color: "#FF6B1A",
    colorLight: "#FFF4ED",
    need: "Spot local heatspots and guide neighbors",
    provide: "Simple heat map, risk scores, easy-to-use dashboard",
    imageSrc: "/Volunteer.png",
    imageAlt: "Neighborhood volunteers",
  },
  {
    id: 2,
    title: "NGOs & Community",
    color: "#2D5F2E",
    colorLight: "#F0FAF0",
    need: "Support residents and run awareness campaigns",
    provide: "Easy-to-understand heat visualization and hotspot data; CSV export for reporting",
    imageSrc: "/NGO.png",
    imageAlt: "NGO community",
  },
  {
    id: 3,
    title: "Residents",
    color: "#C44F00",
    colorLight: "#FFF4ED",
    need: "Understand neighborhood heat risk and locate healthcare when needed.",
    provide: "Color-coded map, visual alerts, and nearby clinic locator; responsiev web access on mobile and desktop.",
    imageSrc: "/family.png",
    imageAlt: "Family",
  },
];

function NeedProvideCard({ label, text, color, isNeed }) {
  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--x', event.clientX - rect.left);
    event.currentTarget.style.setProperty('--y', event.clientY - rect.top);
  };

  return (
    <div
      className={`need-provide-card${isNeed ? ' need-card' : ' provide-card'}`}
      onPointerMove={handlePointerMove}
      style={{
        background: isNeed ? `${color}1a` : `${color}2a`,
        border: `1px solid ${color}`,
        borderRadius: 18,
        padding: "2.25rem 2rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        '--glow-color': color,
      }}
    >
      <div className="need-provide-content">
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 16,
        }}>
          <div style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            color: "#fff",
            fontWeight: 700,
          }}>
            {isNeed ? (
              <img src="/need.png" alt="Need" className="need-icon" />
            ) : (
              "✦"
            )}
          </div>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: color,
            textTransform: "uppercase",
          }}>
            {label}
          </span>
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 17,
          color: "#2D2D2D",
          margin: 0,
          lineHeight: 1.7,
        }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function PersonaSection({ persona }) {
  return (
    <div style={{
      width: "100%",
      marginBottom: "6rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Image section */}
      <div className="built-for-image-section" style={{
        width: "100%",
        marginBottom: "4rem",
        display: "flex",
        justifyContent: "center",
      }}>
        <div className="outer-rectangle" style={{ background: `linear-gradient(135deg, ${persona.color} 0%, ${persona.color}cc 100%)` }}>
          <div className="inner-rectangle" style={{ background: `linear-gradient(135deg, ${persona.color}dd 0%, ${persona.color}99 100%)` }}></div>
          <img
            src={persona.imageSrc}
            alt={persona.imageAlt}
            className={`city-hall-image${persona.imageSrc === "/Volunteer.png" ? " volunteer-image" : ""}`}
          />
        </div>
      </div>

      {/* Content wrapper - centered */}
      <div style={{
        width: "100%",
        maxWidth: "1200px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 10,
      }}>
        {/* Heading */}
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "3.75rem",
          fontWeight: 700,
          color: persona.color,
          margin: "0 0 2rem 0",
          letterSpacing: "-0.02em",
          textAlign: "center",
          width: "100%",
          position: "relative",
          zIndex: 10,
        }}>
          {persona.title}
        </h2>
        
        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2rem",
          width: "100%",
          maxWidth: "1000px",
        }}>
          <NeedProvideCard
            label="Need"
            text={persona.need}
            color={persona.color}
            isNeed={true}
          />
          <NeedProvideCard
            label="We Provide"
            text={persona.provide}
            color={persona.color}
            isNeed={false}
          />
        </div>
      </div>
    </div>
  );
}

function BuiltForSection() {
  return (
    <section className="built-for-section">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&family=DM+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <div className="built-for-container">
        <div className="built-for-content">
          {/* Heading Section with Visual */}
          <div className="built-for-heading-container" style={{ position: "relative" }}>
            {/* Orange banner background */}
            <div className="built-for-separator"></div>
            
            {/* Left: Rectangle with Image */}
            <div className="built-for-visual-section" style={{ position: "relative", zIndex: 1 }}>
              <div className="built-for-rectangle">
                <img src="/everyone.png" alt="Tile" className="built-for-tile-image" />
              </div>
            </div>
            
            {/* Right: Text */}
            <div className="built-for-text-section" style={{ position: "relative", zIndex: 1 }}>
              <h2 className="built-for-subtitle">Built For</h2>
              <h1 className="built-for-title">Everyone</h1>
            </div>
          </div>
          
          <div style={{ width: "100%", marginTop: "6rem" }}>
            {personas.map(p => (
              <PersonaSection key={p.id} persona={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuiltForSection;
