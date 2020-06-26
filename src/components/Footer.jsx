import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import { setLocale } from '../modules/app/actions';
import Button from './Button';
import Link from './Link';

const dotSpacing = 8;

export default function Footer() {
  const dispatch = useDispatch();

  return (
    <div style={{ width: '100%', paddingBottom: 16 }}>
      <Divider />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '24px 12px',
        }}
      >
        <Typography>
          <FormattedMessage id="FLUKEBOOK_IS_AN_INSTANCE_OF" />
          <Link href="http://wildbook.org/">Wildbook</Link>
          <FormattedMessage id="CREATED_BY_THE_FOLKS_AT" />
          <Link href="http://wildme.org/">Wild Me</Link>
          <FormattedMessage id="END_OF_SENTENCE" />
        </Typography>
        <Typography style={{ marginTop: 16 }}>
          <Link
            style={{ marginRight: dotSpacing }}
            href="http://wiki.wildbook.org/contact-us"
            external
          >
            <FormattedMessage id="CONTACT" />
          </Link>
          {' • '}
          <Link
            href="http://wiki.wildbook.org/legal"
            external
            style={{
              marginRight: dotSpacing,
              marginLeft: dotSpacing,
            }}
          >
            <FormattedMessage id="LEGAL" />
          </Link>
          {' • '}
          <Link
            href="http://wiki.wildbook.org/"
            external
            style={{
              marginRight: dotSpacing,
              marginLeft: dotSpacing,
            }}
          >
            <FormattedMessage id="DOCS" />
          </Link>
          {' • '}
          <Link
            href="https://community.wildbook.org/"
            external
            style={{ marginLeft: dotSpacing }}
          >
            <FormattedMessage id="COMMUNITY" />
          </Link>
        </Typography>
      </div>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <Divider />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Button
              style={{ textTransform: 'unset' }}
              onClick={() => dispatch(setLocale('en'))}
              display="basic"
            >
              English
            </Button>
            <Button
              style={{ textTransform: 'unset' }}
              onClick={() => dispatch(setLocale('es'))}
              display="basic"
            >
              Español
            </Button>
          </div>
          <div>
            <IconButton href="https://twitter.com/wildbookORG">
              <TwitterIcon />
            </IconButton>
            <IconButton href="https://www.facebook.com/wildmeorg/">
              <FacebookIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
