import React from 'react';
import ReactPlayer from 'react-player';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ScrollIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import { selectSiteSettings } from '../../modules/site/selectors';
import UnauthenticatedAppHeader from '../../components/UnauthenticatedAppHeader';
import Button from '../../components/Button';
import Trifold from './Trifold';
import HowItWorks from './HowItWorks';
import Testimonial from './Testimonial';
import Metrics from './Metrics';
import HelpAsk from './HelpAsk';
import Footer from './Footer';

export default function Splash() {
  const intl = useIntl();
  const theme = useTheme();
  const siteSettings = useSelector(selectSiteSettings);

  useDocumentTitle(
    intl.formatMessage(
      { id: 'WELCOME_TO_SITENAME' },
      { siteName: siteSettings.siteName },
    ),
    false,
  );

  const themeColor = '#00fff7';

  return (
    <div>
      <UnauthenticatedAppHeader siteNameScrolls topTransparency />
      <Fab
        size="small"
        onClick={() =>
          window.scroll({ top: 0, left: 0, behavior: 'smooth' })
        }
        style={{
          zIndex: 1,
          bottom: 20,
          right: 20,
          position: 'fixed',
          backgroundColor: themeColor,
        }}
      >
        <ScrollIcon />
      </Fab>
      <div style={{ position: 'relative' }}>
        <ReactPlayer
          url={siteSettings.splashVideo}
          muted
          autoPlay
          playing
          width="100vw"
          height="auto"
          style={{ filter: 'brightness(0.5)' }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            width: '100vw',
            textAlign: 'center',
            color: theme.palette.getContrastText('rgba(0, 0, 0, 0)'),
          }}
        >
          <Typography variant="h3">
            AI for Whale Shark Research
          </Typography>
          <Typography variant="subtitle1">
            Upload your whale shark images. Help save the species.
          </Typography>
          <Button
            display="primary"
            style={{
              marginTop: 16,
              backgroundColor: themeColor,
              color: 'black',
              padding: '12px 28px',
              borderRadius: 300,
            }}
          >
            Report Sighting
          </Button>
        </div>
      </div>
      <Trifold />
      <HowItWorks textColor={themeColor} padding={20} />
      <Testimonial />
      <Metrics />
      <HelpAsk />
      <Footer />
    </div>
  );
}
