import React from 'react';
import Typography from '@material-ui/core/Typography';
import savanna from '../assets/savanna.jpeg';

export default function NotFoundPage({ title, subtitle, details }) {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        color: 'white',
        backgroundImage: `url(${savanna})`,
        backgroundSize: 'cover',
      }}
    >
      <div
        style={{
          marginTop: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" style={{ fontSize: 120 }}>
          {title}
        </Typography>
        <Typography variant="h4">{subtitle}</Typography>
        <Typography style={{ maxWidth: 400, marginTop: 16 }}>
          {details}
        </Typography>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
        <Typography>
          Photo by
          <a href="https://unsplash.com/@davidclode">David Clode</a>
          on
          <a href="https://unsplash.com/photos/92MgFhlWD-8">
            Unsplash
          </a>
        </Typography>
      </div>
    </div>
  );
}
