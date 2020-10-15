import React from 'react';
import Typography from '@material-ui/core/Typography';
import nature from '../assets/nature.jpg';
import Link from './Link';

export default function ServerErrorPage({
  title,
  subtitle,
  details,
}) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        color: 'white',
        backgroundImage: `url(${nature})`,
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          height: '100vh',
        }}
      >
        <Typography
          variant="h2"
          component="h2"
          style={{ marginTop: 100 }}
        >
          {title}
        </Typography>
        <Typography variant="h4">{subtitle}</Typography>
        <Typography style={{ maxWidth: 400, marginTop: 16 }}>
          {details}
        </Typography>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
        <Typography>
          {'Photo by '}
          <Link external href="https://unsplash.com/@editholic7">
            Kunal Shinde
          </Link>
          {' on '}
          <Link
            external
            href="https://unsplash.com/photos/-f0YLss50Bs"
          >
            Unsplash
          </Link>
        </Typography>
      </div>
    </div>
  );
}
