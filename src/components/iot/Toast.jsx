import React, { useEffect } from 'react';
import { Ic } from './IotIcons.jsx';
import { T } from './theme.js';

/**
 * Success toast notification; auto-dismisses after 2.2s.
 */
export default function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  if (!message) return null;

  return (
    <div className="iot-toast" role="status" aria-live="polite">
      <div className="iot-toast-icon">
        <Ic.Check c="#fff" s={11} />
      </div>
      {message}
    </div>
  );
}
