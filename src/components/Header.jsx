import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import Button from './Button';
import ButtonLink from './ButtonLink';
import Text from './Text';

export default function Header({
  title,
  showButton,
  showButtonLink,
  buttonLinkHref,
  buttonText,
  onButtonClick,
  showSettings,
  onSettingsClick,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <Text
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
      >
        {title}
      </Text>
      {showButton && (
        <Button
          onClick={onButtonClick}
          style={{ margin: '16px 8px' }}
        >
          {buttonText}
        </Button>
      )}
      {showButtonLink && (
        <ButtonLink
          href={buttonLinkHref}
          style={{ margin: '16px 8px' }}
        >
          {buttonText}
        </ButtonLink>
      )}
      {showSettings && (
        <IconButton onClick={onSettingsClick}>
          <SettingsIcon />
        </IconButton>
      )}
    </div>
  );
}
