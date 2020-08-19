import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Link from './Link';

export default function UnauthenticatedAppHeader({
  topTransparency = false,
}) {
  const [top, setTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY === 0) {
        setTop(true);
      } else {
        setTop(false);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      style={{
        height: 64,
        width: '100%',
        position: 'fixed',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:
          top && topTransparency ? 'rgba(0,0,0,0)' : 'black',
        transition:
          'background-color .5s cubic-bezier(.165,.84,.44,1)',
        willChange: 'background-color',
        padding: 40,
      }}
    >
      <Typography variant="h6" style={{ color: 'white' }}>
        Wild Me for Whale Sharks
      </Typography>
      <Link style={{ color: 'white' }} href="/login">
        Log in
      </Link>
    </div>
  );
}
