import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function Header({
  title,
  showButton,
  buttonText,
  onButtonClick,
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
      <Typography
        variant="h3"
        component="h3"
        style={{ padding: '16px 0 16px 16px' }}
      >
        {title}
      </Typography>
      {showButton && (
        <Button
          onClick={onButtonClick}
          variant="outlined"
          style={{ margin: '16px 8px' }}
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
