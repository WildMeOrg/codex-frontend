import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Typography from '@material-ui/core/Typography';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';

import HeaderMenu from './HeaderMenu';
import Link from './Link';
import InlineButton from './InlineButton';

const languages = ['English', 'Español', 'Deutch'];
const activeLanguage = 'English';

export default function UnauthenticatedAppHeader({
  topTransparency = false,
  siteNameScrolls = false,
}) {
  const [top, setTop] = useState(true);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

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

  const inactiveLanguages = languages.filter(
    language => language !== activeLanguage,
  );

  const siteName = 'Wild Me for Whale Sharks';

  return (
    <div
      style={{
        height: 64,
        width: '100%',
        position: 'fixed',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:
          top && topTransparency ? 'rgba(0,0,0,0)' : 'black',
        transition:
          'background-color .5s cubic-bezier(.165,.84,.44,1)',
        willChange: 'background-color',
        padding: 40,
      }}
    >
      <Typography
        variant="h6"
        style={{ color: 'white', marginRight: 12 }}
      >
        {siteNameScrolls ? (
          <InlineButton
            noUnderline
            onClick={() => window.scrollTo(0, 0)}
          >
            {siteName}
          </InlineButton>
        ) : (
          <Link href="/" noUnderline>
            {siteName}
          </Link>
        )}
      </Typography>
      <div style={{ display: 'flex' }}>
        {languageMenuOpen && (
          <ClickAwayListener
            onClickAway={() => {
              setLanguageMenuOpen(false);
            }}
          >
            <div />
          </ClickAwayListener>
        )}
        <div style={{ color: 'white', flexShrink: 0 }}>
          <InlineButton
            noUnderline
            style={{
              textTransform: 'unset',
              fontWeight: 300,
              fontSize: 16,
              letterSpacing: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
          >
            English
            <DropDownIcon />
          </InlineButton>
          <HeaderMenu
            open={languageMenuOpen}
            itemCount={inactiveLanguages.length}
            style={{ right: 12 }}
          >
            <MenuList onClick={() => setLanguageMenuOpen(false)}>
              {inactiveLanguages.map(language => (
                <InlineButton
                  key={language}
                  noUnderline
                  style={{ width: '100%' }}
                >
                  <MenuItem className="dark-menu-item">
                    <Typography>{language}</Typography>
                  </MenuItem>
                </InlineButton>
              ))}
            </MenuList>
          </HeaderMenu>
        </div>
        <Link
          noUnderline
          style={{ color: 'white', marginLeft: 20, flexShrink: 0 }}
          href="/login"
        >
          <Typography>
            <FormattedMessage id="LOG_IN" />
          </Typography>
        </Link>
      </div>
    </div>
  );
}
