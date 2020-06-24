import React from 'react';
import { Player } from 'video-react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import useDocumentTitle from '../../../hooks/useDocumentTitle';
import openSource from '../../../assets/graphic-opensource.png';
import identification from '../../../assets/graphic-identification.png';
import searchExport from '../../../assets/graphic-searchexport.png';
import shane from '../../../assets/shane.jpg';
import { selectSiteSettings } from '../../../modules/site/selectors';
import Map from './Map';

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
        <Button color="secondary" variant="contained">
          <FormattedMessage id="REPORT_A_SIGHTING" />
        </Button>
      </div>
      <div>
        <Button>
          <FormattedMessage id="LEARN_MORE" />
        </Button>
      </div>
    </div>
  );
}

function SexyLine() {
  return (
    <Divider
      style={{
        marginTop: 32,
        height: 1,
        width: 108,
        backgroundColor: 'black',
      }}
    />
  );
}

export default function Splash() {
  const intl = useIntl();
  const siteSettings = useSelector(selectSiteSettings);

  useDocumentTitle(
    intl.formatMessage(
      { id: 'WELCOME_TO_SITENAME' },
      { siteName: siteSettings.siteName },
    ),
    false,
  );

  return (
    <div style={{ marginTop: 64 }}>
      <div style={{ position: 'relative' }}>
        <Player playsInline autoPlay>
          <source src={siteSettings.splashVideo} />
        </Player>
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            width: '100vw',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="h3">{siteSettings.tagline}</Typography>
        </div>
      </div>
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
            <img src={openSource} style={{ height: 108 }} />
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
            <img src={identification} style={{ height: 108 }} />
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
            <img src={searchExport} style={{ height: 108 }} />
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
      <Map />
      <div
        style={{
          width: '100vw',
          maxWidth: 900,
          textAlign: 'center',
          margin: '64px auto',
        }}
      >
        <Grid container>
          <Grid item>
            <div
              style={{
                backgroundImage: `url(${shane})`,
                borderRadius: 1000,
                backgroundSize: 'cover',
                border: '6px solid purple',
                margin: '16px 40px 0 40px',
                height: 140,
                width: 140,
              }}
            />
          </Grid>
          <Grid
            item
            style={{
              textAlign: 'left',
              margin: '16px 40px 0 40px',
              width: '60%',
              minWidth: 240,
            }}
          >
            <Typography>
              “Sperm whales roam so vastly that no one research group
              can study them across their range. PhotoID as a tool for
              conservation and research finds power in numbers and
              international, inter-institutional collaboration.
              Flukebook enables us to do this easily.”
            </Typography>
            <Typography variant="subtitle1" style={{ marginTop: 12 }}>
              SHANE GERO
            </Typography>
            <Typography variant="subtitle2">
              The Dominica Sperm Whale Project
            </Typography>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
