import React, { useEffect, useState } from 'react';

import { useTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import DropDownIcon from '@material-ui/icons/ArrowDropDown';

import HeaderMenu from './HeaderMenu';
import Link from './Link';
import InlineButton from './InlineButton';
import BannerLogo from './BannerLogo';
import Text from './Text';

const languages = ['English', 'Español', 'Deutch'];
const activeLanguage = 'English';

export default function UnauthenticatedAppHeader({
  topTransparency = false,
  siteNameScrolls = false,
}) {
  const theme = useTheme();
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
          top && topTransparency
            ? 'rgba(0,0,0,0)'
            : theme.palette.common.black,
        transition:
          'background-color .5s cubic-bezier(.165,.84,.44,1)',
        willChange: topTransparency ? 'background-color' : 'unset',
        padding: 40,
      }}
    >
      <BannerLogo
        href={siteNameScrolls ? '/' : 'unset'}
        onClick={
          siteNameScrolls ? () => window.scrollTo(0, 0) : 'unset'
        }
      />
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
        <div
          style={{ color: theme.palette.common.white, flexShrink: 0 }}
        >
          <InlineButton
            noUnderline
            style={{
              textTransform: 'unset',
              fontSize: 16,
              letterSpacing: '0.04em',
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
                    <Text>{language}</Text>
                  </MenuItem>
                </InlineButton>
              ))}
            </MenuList>
          </HeaderMenu>
        </div>
        <Link
          noUnderline
          style={{
            color: theme.palette.common.white,
            marginLeft: 20,
            flexShrink: 0,
          }}
          href="/login"
        >
          <Text id="LOG_IN" />
        </Link>
      </div>
    </div>
  );
}
