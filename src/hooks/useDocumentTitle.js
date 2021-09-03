import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectSiteName } from '../modules/site/selectors';

export default function(message, appendSitename = true) {
  const siteName = useSelector(selectSiteName);
  useEffect(
    () => {
      if (appendSitename && siteName) {
        document.title = `${message} • ${siteName}`;
      } else {
        document.title = message;
      }
    },
    [message],
  );
}
