import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import openSource from '../../assets/graphic-opensource.png';
import identification from '../../assets/graphic-identification.png';
import searchExport from '../../assets/graphic-searchexport.png';
import { selectSiteSettings } from '../../modules/site/selectors';
import ButtonLink from '../../components/ButtonLink';

const graphicSize = 108;

function Card({ children }) {
  return (
    <Grid
      item
      style={{
        width: 240,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 60,
      }}
    >
      {children}
    </Grid>
  );
}

function Cta() {
  return (
    <div
      style={{
        margin: '0 auto 40px auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <ButtonLink
          href="/report"
          display="primary"
          style={{ width: 240 }}
        >
          <FormattedMessage id="REPORT_A_SIGHTING" />
        </ButtonLink>
      </div>
      <div>
        <ButtonLink
          display="secondary"
          style={{ width: 240, marginTop: 12 }}
          external
          href="http://wiki.wildbook.org/en/researchers/overview"
        >
          <FormattedMessage id="LEARN_MORE" />
        </ButtonLink>
      </div>
    </div>
  );
}

function SexyLine() {
  const theme = useTheme();
  return (
    <Divider
      style={{
        marginTop: 32,
        height: 1,
        width: graphicSize,
        backgroundColor: theme.palette.common.black,
      }}
    />
  );
}

export default function Trifold() {
  const siteSettings = useSelector(selectSiteSettings);

  return (
    <div
      style={{
        width: '100vw',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: 64,
      }}
    >
      <Typography variant="h3" style={{ marginBottom: 64 }}>
        <FormattedMessage id="TRIFOLD_TAGLINE" />
      </Typography>
      <Grid
        container
        justify="space-around"
        style={{ maxWidth: 1100, margin: '0 auto' }}
      >
        <Card>
          <img
            src={openSource}
            alt="Open source graphic"
            style={{ height: graphicSize }}
          />
          <SexyLine />
          <Typography
            variant="subtitle1"
            style={{ marginTop: 12, marginBottom: 4 }}
          >
            <FormattedMessage id="OPEN_SOURCE" />
          </Typography>
          <Typography>
            <FormattedMessage
              id="OPEN_SOURCE_DESCRIPTION"
              values={{ siteName: 'Flukebook' }}
            />
          </Typography>
        </Card>
        <Card>
          <img
            src={identification}
            alt="Identification graphic"
            style={{ height: graphicSize }}
          />
          <SexyLine />

          <Typography
            variant="subtitle1"
            style={{ marginTop: 12, marginBottom: 4 }}
          >
            <FormattedMessage id="AUTOMATIC_IDENTIFICATION" />
          </Typography>
          <Typography>
            <FormattedMessage id="AUTOMATIC_IDENTIFICATION_DESCRIPTION" />
          </Typography>
        </Card>
        <Card>
          <img
            src={searchExport}
            alt="Search and export graphic"
            style={{ height: graphicSize }}
          />
          <SexyLine />

          <Typography
            variant="subtitle1"
            style={{ marginTop: 12, marginBottom: 4 }}
          >
            <FormattedMessage id="SEARCH_AND_EXPORT" />
          </Typography>
          <Typography>{siteSettings.exploreTagline}</Typography>
        </Card>
      </Grid>
      <Cta />
    </div>
  );
}
