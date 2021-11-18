import React from 'react';
import { get } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IdentificationIcon from '@material-ui/icons/Fingerprint';
import CodeIcon from '@material-ui/icons/Code';
import AnalysisIcon from '@material-ui/icons/BarChart';
import Text from '../../components/Text';
import useSiteSettings from '../../models/site/useSiteSettings';

const Card = function({ Icon, titleId, descriptionId }) {
  const theme = useTheme();

  return (
    <Grid
      item
      style={{
        width: 240,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 48,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.palette.primary.main,
          padding: 12,
          height: 108,
          width: 108,
          borderRadius: 10000,
        }}
      >
        <Icon
          style={{ fontSize: 64, color: theme.palette.common.black }}
        />
      </div>
      <Text
        responsive
        variant="h5"
        style={{ marginTop: 40, marginBottom: 20 }}
        id={titleId}
      />
      <Text
        style={{
          color: '#818181',
          lineHeight: '25px',
          fontSize: 18,
          letterSpacing: '0.04em',
          fontWeight: 400,
        }}
        id={descriptionId}
      />
    </Grid>
  );
};

export default function Trifold() {
  const { data: siteSettings, loading, error } = useSiteSettings();
  const siteDescription = get(
    siteSettings,
    ['site.general.description', 'value'],
    '',
  );

  if (loading || error) return null;

  return (
    <div
      style={{
        width: '100vw',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 40,
        padding: 20,
      }}
    >
      <Text
        responsive
        variant="h2"
        style={{ marginBottom: 48 }}
        id="TRIFOLD_TAGLINE"
      />
      <Text
        responsive
        desktopStyle={{
          fontSize: 24,
          lineHeight: '45px',
        }}
        mobileStyle={{
          fontSize: 16,
          lineHeight: '30px',
        }}
        style={{
          maxWidth: 900,
          padding: '0px 20px',
          marginBottom: 60,
          letterSpacing: '0.04em',
        }}
      >
        {siteDescription}
      </Text>
      <Grid
        container
        justifyContent="space-around"
        style={{ maxWidth: 900, margin: '0 auto' }}
      >
        <Card
          titleId="OPEN_SOURCE"
          descriptionId="OPEN_SOURCE_DESCRIPTION"
          Icon={CodeIcon}
        />
        <Card
          titleId="AUTOMATIC_IDENTIFICATION"
          descriptionId="AUTOMATIC_IDENTIFICATION_DESCRIPTION"
          Icon={IdentificationIcon}
        />
        <Card
          titleId="ANALYZE_AND_EXPORT"
          descriptionId="ANALYZE_AND_EXPORT_DESCRIPTION"
          Icon={AnalysisIcon}
        />
      </Grid>
    </div>
  );
}
