import React from 'react';
import { get } from 'lodash-es';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import Button from '../../components/Button';
import Text from '../../components/Text';
import useSiteSettings from '../../models/site/useSiteSettings';
import { selectSiteSettings } from '../../modules/site/selectors';

const imageSize = '25vw';

export default function Testimonial() {
  const oldSiteSettings = useSelector(selectSiteSettings);
  const { data: siteSettings, loading, error } = useSiteSettings();

  const testimonial = get(
    siteSettings,
    ['site.general.testimonial', 'value'],
    '',
  );
  const testimonialCitation = get(
    siteSettings,
    ['site.general.testimonialCitation', 'value'],
    '',
  );

  if (loading || error) return null;

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
              oldSiteSettings.testimonialAuthorImage
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
        <Text
          responsive
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
          {`"${testimonial ||
            'Set up your testimonial in the site settings menu.'}"`}
        </Text>
        <Text
          responsive
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
          {testimonialCitation}
        </Text>
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
