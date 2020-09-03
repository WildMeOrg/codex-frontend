import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import Button from '../../components/Button';
import { selectSiteSettings } from '../../modules/site/selectors';

export default function Testimonial() {
  const intl = useIntl();
  const siteSettings = useSelector(selectSiteSettings);

  useDocumentTitle(
    intl.formatMessage(
      { id: 'WELCOME_TO_SITENAME' },
      { siteName: siteSettings.siteName },
    ),
    false,
  );

  const imageSize = 220;

  return (
    <Grid
      container
      justify="center"
      style={{
        width: '100vw',
        maxWidth: 900,
        margin: '64px auto',
      }}
    >
      <Grid item style={{ marginBottom: 20 }}>
        <div
          style={{
            backgroundImage: `url(${
              siteSettings.testimonialAuthorImage
            })`,
            borderRadius: 1000,
            backgroundSize: 'cover',
            float: 'right',
            height: imageSize,
            width: imageSize,
          }}
        />
      </Grid>
      <Grid
        item
        style={{
          textAlign: 'left',
          maxWidth: 400,
          margin: '16px 40px 0 40px',
        }}
      >
        <Typography style={{ fontStyle: 'italic' }}>
          {`"${siteSettings.testimonial}"`}
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ marginTop: 12, textTransform: 'uppercase' }}
        >
          {`${siteSettings.testimonialAuthor}, ${
            siteSettings.testimonialAuthorCredentials
          }`}
        </Typography>
        <Button
          display="primary"
          style={{
            marginTop: 12,
          }}
        >
          See contributors
        </Button>
      </Grid>
    </Grid>
  );
}
