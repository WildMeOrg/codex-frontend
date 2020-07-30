import { useEffect, useState } from 'react';

export default function useDimensions(ref) {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const setDimensions = () => {
    if (ref && ref.current) {
      setWidth(ref.current.getBoundingClientRect().width);
      setHeight(ref.current.getBoundingClientRect().height);
    }
  };

  useEffect(() => {
    /* browser reports incorrect dimensions until after first repaint */
    setTimeout(setDimensions, 0);

    if (ref && ref.current) {
      setWidth(ref.current.getBoundingClientRect().width);
      setHeight(ref.current.getBoundingClientRect().height);
    }

    window.addEventListener('resize', setDimensions);

    return () => {
      window.removeEventListener('resize', setDimensions);
    };
  }, []);

  return { width, height };
}
