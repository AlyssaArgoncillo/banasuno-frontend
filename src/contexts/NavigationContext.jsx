import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationLoader from '../components/NavigationLoader';

const NavigationContext = createContext(null);

const LOADER_DURATION_MS = 1200;

export function NavigationProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isLoading) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  const navigateWithLoader = useCallback((to, options = {}) => {
    const { onClick } = options;
    return (e) => {
      if (onClick) onClick(e);
      if (e?.defaultPrevented) return;
      e?.preventDefault?.();
      setIsLoading(true);
      setTimeout(() => {
        if (typeof to === 'string' && to.includes('#')) {
          const [pathname, hashPart] = to.split('#');
          navigate(
            { pathname: pathname || '/', hash: hashPart ? `#${hashPart}` : undefined },
            { preventScrollReset: true }
          );
        } else {
          navigate(to);
        }
        setIsLoading(false);
      }, LOADER_DURATION_MS);
    };
  }, [navigate]);

  return (
    <NavigationContext.Provider value={{ isLoading, setIsLoading, navigateWithLoader }}>
      {children}
      {isLoading && <NavigationLoader />}
    </NavigationContext.Provider>
  );
}

export function useNavigationLoader() {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    return {
      isLoading: false,
      setIsLoading: () => {},
      navigateWithLoader: (to) => (e) => {
        e?.preventDefault?.();
        window.location.href = to;
      },
    };
  }
  return ctx;
}
