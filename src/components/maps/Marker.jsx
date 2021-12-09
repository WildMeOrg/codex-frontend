import React, { useState, useEffect } from 'react';
import { get } from 'lodash-es';
import IconButton from '@material-ui/core/IconButton';

import ButtonLink from '../ButtonLink';
import Text from '../Text';

export default function Marker({
  entry,
  currentMarkerToShow,
  setCurrentMarkerToShow,
  children,
}) {
  const [showInfo, setShowInfo] = useState(false);
  useEffect(
    () => {
      const thisMarkersSightingId = get(entry, 'guid');
      setShowInfo(currentMarkerToShow === thisMarkersSightingId);
    },
    [currentMarkerToShow],
  );
  return (
    <div>
      {showInfo ? (
        <div
          style={{ backgroundColor: 'white', width: 'max-content' }}
        >
          <ButtonLink
            href={`/sightings/${get(entry, 'guid')}`}
            newTab
            external
            size="small"
            style={{
              backgroundColor: 'white',
              borderRadius: 0,
              textTransform: 'none',
            }}
          >
            <Text
              variant="body2"
              style={{
                textDecoration: 'underline',
              }}
            >
              {get(entry, 'text')}
            </Text>
          </ButtonLink>
        </div>
      ) : (
        <IconButton
          style={{ backgroundColor: 'transparent' }}
          onClick={event => {
            event.stopPropagation();
            setCurrentMarkerToShow(get(entry, 'guid'));
          }}
        >
          {children}
        </IconButton>
      )}
    </div>
  );
}
