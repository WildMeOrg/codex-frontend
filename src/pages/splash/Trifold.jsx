import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IdentificationIcon from '@material-ui/icons/Fingerprint';
import CodeIcon from '@material-ui/icons/Code';
import AnalysisIcon from '@material-ui/icons/BarChart';

function Card({ Icon, titleId, descriptionId }) {
  const theme = useTheme();

  return (
    <Grid
      item
      style={{
        width: 240,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 40,
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
          style={{ fontSize: 64, color: theme.palette.common.white }}
        />
      </div>
      <Typography
        variant="h6"
        style={{ marginTop: 20, marginBottom: 4 }}
      >
        <FormattedMessage id={titleId} />
      </Typography>
      <Typography variant="body2">
        <FormattedMessage id={descriptionId} />
      </Typography>
    </Grid>
  );
}

export default function Trifold() {
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
      <Typography variant="h3" style={{ marginBottom: 40 }}>
        <FormattedMessage id="TRIFOLD_TAGLINE" />
      </Typography>
      <Typography
        style={{
          maxWidth: 600,
          padding: '0px 20px',
          marginBottom: 40,
        }}
      >
        <FormattedMessage id="TRIFOLD_DESCRIPTION" />
      </Typography>
      <Grid
        container
        justify="space-around"
        style={{ maxWidth: 800, margin: '0 auto' }}
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
