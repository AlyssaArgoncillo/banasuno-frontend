import { createPortal } from 'react-dom';
import '../styles/NavigationLoader.css';

export default function NavigationLoader() {
  const content = (
    <div className="navigation-loader-overlay" role="status" aria-live="polite" aria-label="Loading">
      <div className="navigation-loader-content">
        <div className="radar-loader">
          <span className="radar-ring" aria-hidden />
          <span className="radar-ring" aria-hidden />
        </div>
        <p className="navigation-loader-text">Taking you there...</p>
      </div>
    </div>
  );
  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
