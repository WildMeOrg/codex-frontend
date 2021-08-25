import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { get } from 'lodash-es';
import { useIntl, FormattedMessage } from 'react-intl';
import { useTheme } from '@material-ui/core/styles';
import ScrollIcon from '@material-ui/icons/KeyboardArrowUp';
import Fab from '@material-ui/core/Fab';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';
import useSiteSettings from '../../models/site/useSiteSettings';
import poweredBy from '../../assets/powered-by.png';
import Trifold from './Trifold';
import HowItWorks from './HowItWorks';
import Testimonial from './Testimonial';
import Metrics from './Metrics';
import HelpAsk from './HelpAsk';
import Social from './Social';

const mediaStyles = {
  objectFit: 'cover',
  objectPosition: '50% 50%',
  width: '100%',
  height: '100%',
};

export default function Splash() {
  const intl = useIntl();
  const theme = useTheme();
  const { data: newSiteSettings, loading, error } = useSiteSettings();

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
      { siteName: get(newSiteSettings, ['site.name', 'value']) },
    ),
    false,
  );

  if (loading || error) return null;

  const splashVideo = get(newSiteSettings, [
    'site.images',
    'splashVideo',
  ]);
  const splashImage = get(newSiteSettings, [
    'site.images',
    'splashImage',
  ]);
  const displaySplashImage = splashImage && !splashVideo;

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
          background: theme.palette.grey['900'],
        }}
      >
        {splashVideo ? (
          <ReactPlayer
            url={splashVideo}
            muted
            autoPlay
            playing
            width="100%"
            height="100%"
            style={{ filter: 'brightness(0.5)' }}
            config={{
              file: {
                attributes: {
                  style: mediaStyles,
                },
              },
            }}
          />
        ) : null}
        {displaySplashImage ? (
          <img
            alt="Home page background"
            src={splashImage}
            style={mediaStyles}
          />
        ) : null}
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
          <Text responsive variant="h1">
            {get(newSiteSettings, ['site.general.tagline', 'value'])}
          </Text>
          <Text responsive variant="subtitle1">
            {get(newSiteSettings, [
              'site.general.taglineSubtitle',
              'value',
            ])}
          </Text>
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
        <a
          href="https://www.wildme.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            textDecoration: 'unset',
          }}
        >
          <img
            src={poweredBy}
            style={{ width: 240 }}
            alt="Powered by Wild Me Codex"
          />
        </a>
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
