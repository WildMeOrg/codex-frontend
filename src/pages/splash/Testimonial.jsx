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

  const imageSize = '25vw';

  return (
    <Grid
      container
      justify="center"
      style={{
        width: '100vw',
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
          maxWidth: 480,
          marginLeft: 120,
        }}
      >
        <Typography
          style={{
            fontStyle: 'italic',
            fontSize: 24,
            lineHeight: '35px',
            letterSpacing: '0.05em',
          }}
        >
          {`"${siteSettings.testimonial}"`}
        </Typography>
        <Typography
          style={{
            marginTop: 40,
            fontSize: 22,
            letterSpacing: '0.04em',
            fontWeight: 'bold',
          }}
        >
          {`${siteSettings.testimonialAuthor}, ${
            siteSettings.testimonialAuthorCredentials
          }`}
        </Typography>
        <Button
          display="marketing"
          style={{
            marginTop: 52,
          }}
        >
          See contributors
        </Button>
      </Grid>
    </Grid>
  );
}
