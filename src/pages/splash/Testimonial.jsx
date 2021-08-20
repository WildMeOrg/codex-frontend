import React from 'react';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';

import Button from '../../components/Button';
import Text from '../../components/Text';
import useSiteSettings from '../../models/site/useSiteSettings';

const imageSize = '25vw';

export default function CustomCard() {
  const { data: siteSettings, loading, error } = useSiteSettings();

  if (loading || error) return null;

  const buttonUrl = get(siteSettings, [
    'site.general.customCardButtonUrl',
    'value',
  ]);

  const imageUrl = get(siteSettings, [
    'site.images',
    'customCardImage',
  ]);

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
            backgroundImage: `url(${imageUrl})`,
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
          {get(
            siteSettings,
            ['site.general.customCardLine1', 'value'],
            '',
          )}
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
          {get(
            siteSettings,
            ['site.general.customCardLine2', 'value'],
            '',
          )}
        </Text>
        {buttonUrl && (
          <Button
            display="marketing"
            style={{
              marginTop: 52,
            }}
            href={buttonUrl}
          >
            {get(
              siteSettings,
              ['site.general.customCardButtonText', 'value'],
              '',
            )}
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
