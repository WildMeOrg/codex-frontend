import { useEffect } from 'react';

export default function useOnEnter(callback) {
  function onKeyUp(e) {
    console.log('deleteMe keyup entered;');
    if (e.key === 'Enter') {
      console.log('deleteMe Enter was typed');
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
