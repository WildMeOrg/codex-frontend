import React, { useState } from 'react';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import EditAvatar from './EditAvatar';
import defaultProfilePhoto from '../../assets/defaultProfile.jpg';
import { EditOutlined } from '@material-ui/icons';


export default function BigAvatar({
  imageSrc,
  imageGuid,
  userId,
  userDataLoading,
  name,
  editable,
  size = 150,
  annotations,
  square = false,
  chipLabel,
}) {
  const theme = useTheme();
  const [backgroundColor, setBackgroundColor] = useState(theme.palette.primary.main);
  const [editingAvatar, setEditingAvatar] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      {chipLabel && (
        <Chip
          color="primary"
          style={{
            position: 'absolute',
            left: 0,
            bottom: -8,
            width: '100%',
            zIndex: 1,
          }}
          label={chipLabel}
        />
      )}
      <div
        style={{
          borderRadius: square ? 'unset' : '50%',
          border: `1px solid ${theme.palette.grey['500']}`,
          cursor: editable ? 'pointer' : 'unset',
          overflow: 'hidden',
        }}
      >
        <EditAvatar
          userId={userId}
          imageSrc={imageSrc}
          imageGuid={imageGuid}
          visible={editingAvatar}
          square={square}
          onClose={() => setEditingAvatar(false)}
          userDataLoading={userDataLoading}
        />
        {userDataLoading ? (
          <div
            style={{
              width: size,
              height: size,
            }}
          />
        ) : (
          <img
            src={imageSrc || defaultProfilePhoto}
            alt={`Profile for ${name}`}
            style={{
              width: size,
              height: size,
              display: 'block',
            }}
          />
        )}
        {annotations && annotations.length > 0 && (
          <svg
            style={{
              position: 'absolute',
              left: 1,
              top: 1,
              width: size,
              height: size,
            }}
          >
            {annotations.map(annotation => (
              <g key={annotation.id}>
                <rect
                  x={
                    0.01 *
                    size *
                    get(annotation, 'parameters.left', undefined)
                  }
                  y={
                    0.01 *
                    size *
                    get(annotation, 'parameters.top', undefined)
                  }
                  width={
                    0.01 *
                    size *
                    get(annotation, 'parameters.width', undefined)
                  }
                  height={
                    0.01 *
                    size *
                    get(annotation, 'parameters.height', undefined)
                  }
                  stroke="white"
                  fill="none"
                  strokeWidth={8}
                />
                <rect
                  x={
                    0.01 *
                    size *
                    get(annotation, 'parameters.left', undefined)
                  }
                  y={
                    0.01 *
                    size *
                    get(annotation, 'parameters.top', undefined)
                  }
                  width={
                    0.01 *
                    size *
                    get(annotation, 'parameters.width', undefined)
                  }
                  height={
                    0.01 *
                    size *
                    get(annotation, 'parameters.height', undefined)
                  }
                  stroke={theme.palette.secondary.main}
                  fill="none"
                  strokeWidth={4}
                />
              </g>
            ))}
          </svg>
        )}
        {editable && (          
          <div
            style={{
              position: 'absolute',
              right: 1,
              bottom: 1,
              width: 40,
              height: 40,
              borderRadius: '50%',
              opacity: 1,
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: backgroundColor,
            }} 
            // onMouseEnter={() => setBackgroundColor(theme.palette.primary.main)}
            // onMouseLeave={() => setBackgroundColor(theme.palette.primary.main+'26')}
            onClick={() => setEditingAvatar(true)}         
          >
            <EditOutlined   />
          </div>

        )}
      </div>
    </div>
  );
}
