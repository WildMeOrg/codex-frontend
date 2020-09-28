import React from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import Button from '../../components/Button';
import ResponsiveText from '../../components/ResponsiveText';
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
        display: 'flex',
        justifyContent: 'space-evenly',
      }}
    >
      <Grid item style={{ marginBottom: 40 }}>
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
            minHeight: 280,
            minWidth: 280,
          }}
        />
      </Grid>
      <Grid
        item
        style={{
          textAlign: 'left',
          maxWidth: 480,
          padding: '0 20px',
        }}
      >
        <ResponsiveText
          mobileStyle={{
            fontSize: 20,
            lineHeight: '30px',
          }}
          desktopStyle={{
            fontSize: 24,
            lineHeight: '36px',
          }}
          style={{
            fontStyle: 'italic',
            letterSpacing: '0.05em',
          }}
        >
          {`"${siteSettings.testimonial}"`}
        </ResponsiveText>
        <ResponsiveText
          mobileStyle={{
            fontSize: 18,
            lineHeight: '26px',
          }}
          desktopStyle={{
            fontSize: 22,
            lineHeight: '36px',
          }}
          style={{
            marginTop: 40,
            letterSpacing: '0.04em',
            fontWeight: 'bold',
          }}
        >
          {`${siteSettings.testimonialAuthor}, ${
            siteSettings.testimonialAuthorCredentials
          }`}
        </ResponsiveText>
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
