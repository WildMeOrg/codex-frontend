import React, { useState } from 'react';
import { get } from 'lodash-es';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import MoreIcon from '@material-ui/icons/MoreVert';
import BigAvatar from './profilePhotos/BigAvatar';
import Link from './Link';
import Text from './Text';
import InlineButton from './InlineButton';

function Details({ entity, titleKey, renderDetails }) {
  return (
    <>
      <Text
        variant="h6"
        noWrap
        style={{
          marginTop: 12,
          marginBottom: 4,
          lineHeight: 1,
          maxWidth: 250,
        }}
        title={entity[titleKey]}
      >
        {entity[titleKey]}
      </Text>
      {renderDetails(entity)}
    </>
  );
}

export default function EntityCard({
  admin,
  renderDetails,
  entity,
  href,
  canDelete,
  name,
  onDelete,
  imgSrc,
  linkAll = true,
  avatarSize = 150,
  titleKey = 'name',
  annotations,
  justify = 'center',
  square = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    // Anchor the Popover to the icon inside of the button for a cleaner look.
    setAnchorEl(
      get(
        event,
        ['currentTarget', 'children', '0', 'children', '0'],
        event.currentTarget,
      ),
    );
  };

  const handleClose = e => {
    if (e) e.preventDefault();
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const id = popoverOpen ? 'edit-user-menu' : undefined;

  return (
    <Grid item>
      <Link
        noUnderline
        href={href}
        style={{
          display: 'flex',
          alignItems: justify,
          flexDirection: 'column',
        }}
      >
        <div style={{ position: 'relative' }}>
          <BigAvatar
            imgSrc={imgSrc}
            name={name}
            square={square}
            size={avatarSize}
            annotations={annotations}
            admin={admin}
          />
          {canDelete && (
            <>
              <IconButton
                onClick={e => {
                  e.preventDefault();
                  handleClick(e);
                }}
                style={{
                  position: 'absolute',
                  top: -12,
                  right: square ? -52 : -28,
                }}
                aria-describedby={id}
              >
                <MoreIcon size="large" />
              </IconButton>
              <Popover
                open={popoverOpen}
                anchorEl={anchorEl}
                id={id}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{ style: { marginRight: 12 } }}
              >
                <InlineButton
                  style={{ padding: '12px 20px' }}
                  noUnderline
                  onClick={e => {
                    e.preventDefault();
                    handleClose();
                    onDelete();
                  }}
                >
                  Delete
                </InlineButton>
              </Popover>
            </>
          )}
        </div>
        {linkAll && (
          <Details
            renderDetails={renderDetails}
            titleKey={titleKey}
            entity={entity}
          />
        )}
      </Link>
      {!linkAll && (
        <Details
          renderDetails={renderDetails}
          titleKey={titleKey}
          entity={entity}
        />
      )}
    </Grid>
  );
}
