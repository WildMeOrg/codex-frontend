import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import ocean from '../assets/ocean.jpeg';
import savanna from '../assets/savanna.jpeg';
import Link from './Link';

export default function NotFoundPage({
  title,
  subtitle,
  details,
  variant = 'ocean',
}) {
  const imageUrl = variant === 'ocean' ? ocean : savanna;
  const artistName =
    variant === 'ocean' ? 'Pierre Leverrier' : 'David Clode';
  const artistUrl =
    variant === 'ocean'
      ? 'https://unsplash.com/@pierre_leverrier'
      : 'https://unsplash.com/@davidclode';
  const unsplashUrl =
    variant === 'ocean'
      ? 'https://unsplash.com/photos/k0Ynnf2CbKw'
      : 'https://unsplash.com/photos/92MgFhlWD-8';

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        color: 'white',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
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
