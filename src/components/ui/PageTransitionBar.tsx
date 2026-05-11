import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Spinner from './Spinner.tsx';

export default function PageTransitionBar() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setLoading(true), 0);
    const endTimer = setTimeout(() => setLoading(false), 400);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [location.pathname]);

  if (!loading) return null;

  return <Spinner />;
}
