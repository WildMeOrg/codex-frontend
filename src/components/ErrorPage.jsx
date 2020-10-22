import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import oops from '../assets/oops.jpg';
import Link from './Link';

export default function ErrorPage({ title, subtitle, details }) {
  const imageUrl = oops;
  const artistName = 'Paweł Czerwiński';
  const artistUrl = 'https://unsplash.com/@pawel_czerwinski';
  const unsplashUrl = 'https://unsplash.com/photos/OOFSqPWjCt0';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        color: 'white',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        position: 'relative',
      }}
    >
      <div
        style={{
          marginTop: 64,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          style={{ fontSize: 120, marginTop: 40 }}
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
          <FormattedMessage id="PHOTO_BY" />
          <Link external href={artistUrl}>
            {artistName}
          </Link>
          <FormattedMessage id="ON" />
          <Link external href={unsplashUrl}>
            Unsplash
          </Link>
        </Typography>
      </div>
    </div>
  );
}
