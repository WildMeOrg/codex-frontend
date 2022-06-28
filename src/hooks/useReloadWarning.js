import { useEffect } from 'react';

export default function useReloadWarning(enableWarning) {
  useEffect(() => {
    if (enableWarning) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = null;
    }
    return () => {
      window.onbeforeunload = null;
    };
  }, [enableWarning]);
}
