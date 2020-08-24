import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import openSource from '../../assets/graphic-opensource.png';
import identification from '../../assets/graphic-identification.png';
import searchExport from '../../assets/graphic-searchexport.png';

const graphicSize = 108;

function Card({
  imgHeight,
  imgAlt,
  imgSrc,
  backgroundColor,
  titleId,
  descriptionId,
}) {
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
      <img
        src={imgSrc}
        alt={imgAlt}
        style={{
          backgroundColor,
          height: imgHeight,
          padding: 12,
          borderRadius: 100000,
        }}
      />
      <Typography
        variant="subtitle1"
        style={{ marginTop: 20, marginBottom: 4 }}
      >
        <FormattedMessage id={titleId} />
      </Typography>
      <Typography variant="caption">
        <FormattedMessage id={descriptionId} />
      </Typography>
    </Grid>
  );
}

export default function Trifold() {
  const themeColor = '#00fff7';

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
      <Typography variant="h4" style={{ marginBottom: 12 }}>
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
          backgroundColor={themeColor}
          imgAlt="Open source"
          imgSrc={openSource}
          imgHeight={graphicSize}
          titleId="OPEN_SOURCE"
          descriptionId="OPEN_SOURCE_DESCRIPTION"
        />
        <Card
          backgroundColor={themeColor}
          imgAlt="Automatic identification"
          imgSrc={identification}
          imgHeight={graphicSize}
          titleId="AUTOMATIC_IDENTIFICATION"
          descriptionId="AUTOMATIC_IDENTIFICATION_DESCRIPTION"
        />
        <Card
          backgroundColor={themeColor}
          imgAlt="Analyze and export"
          imgSrc={searchExport}
          imgHeight={graphicSize}
          titleId="ANALYZE_AND_EXPORT"
          descriptionId="ANALYZE_AND_EXPORT_DESCRIPTION"
        />
      </Grid>
    </div>
  );
}
