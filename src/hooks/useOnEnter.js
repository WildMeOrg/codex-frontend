import { useEffect } from 'react';

export default function useOnEnter(callback) {
  function onKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback(e);
    }
  }

  useEffect(() => {
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  });
}
