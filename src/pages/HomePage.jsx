/**
 * Main interface / home page.
 * Entry point after landing (e.g. dashboard, map, or main app view).
 */

function HomePage() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1>BanasUno</h1>
        <p>Main interface — heat map, clinic locator, and tools.</p>
      </header>
      <main className="home-main">
        <p>Content for the main interface will go here.</p>
      </main>
    </div>
  );
}

export default HomePage;
