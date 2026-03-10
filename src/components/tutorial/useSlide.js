import { useState, useEffect } from "react";

export function useSlide(step) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 48);
    return () => clearTimeout(t);
  }, [step]);
  return visible;
}
