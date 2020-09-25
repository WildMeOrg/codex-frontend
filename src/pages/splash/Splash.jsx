import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useIntl, FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import ScrollIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import { selectSiteSettings } from '../../modules/site/selectors';
import ButtonLink from '../../components/ButtonLink';
import ResponsiveHeader from '../../components/ResponsiveHeader';
import Trifold from './Trifold';
import HowItWorks from './HowItWorks';
import Testimonial from './Testimonial';
import Metrics from './Metrics';
import HelpAsk from './HelpAsk';
import Social from './Social';

export default function Splash() {
  const intl = useIntl();
  const theme = useTheme();
  const siteSettings = useSelector(selectSiteSettings);
  const [top, setTop] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < 20) {
        setTop(true);
      } else {
        setTop(false);
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useDocumentTitle(
    intl.formatMessage(
      { id: 'WELCOME_TO_SITENAME' },
      { siteName: siteSettings.siteName },
    ),
    false,
  );

  return (
    <div>
      <Fab
        size="small"
        color="primary"
        onClick={() =>
          window.scroll({ top: 0, left: 0, behavior: 'smooth' })
        }
        style={{
          zIndex: 1,
          bottom: 20,
          right: 20,
          position: 'fixed',
          opacity: top ? 0 : 1,
          visibility: top ? 'hidden' : 'visible',
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <ScrollIcon />
      </Fab>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
        }}
      >
        <ReactPlayer
          url={siteSettings.splashVideo}
          muted
          autoPlay
          playing
          width="100%"
          height="100%"
          style={{ filter: 'brightness(0.5)' }}
          config={{
            file: {
              attributes: {
                style: {
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                  width: '100%',
                  height: '100%',
                },
              },
            },
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '35vh',
            width: '100vw',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: theme.palette.common.white,
          }}
        >
          <ResponsiveHeader component="h1">
            AI for Whale Shark Research
          </ResponsiveHeader>
          <ResponsiveHeader component="subtitle1">
            Upload your whale shark images. Help save the species.
          </ResponsiveHeader>
          <ButtonLink
            display="marketing"
            size="large"
            style={{
              marginTop: '8vh',
            }}
            href="/report"
          >
            <FormattedMessage id="REPORT_SIGHTINGS" />
          </ButtonLink>
        </div>
      </div>
      <Trifold />
      <HowItWorks />
      <Testimonial />
      <Metrics />
      <HelpAsk />
      <Social />
    </div>
  );
}
