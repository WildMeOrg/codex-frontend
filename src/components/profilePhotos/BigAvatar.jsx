import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import SvgText from '../SvgText';
import EditAvatar from './EditAvatar';
import defaultProfilePhoto from '../../assets/defaultProfile.jpg';

export default function BigAvatar({
  imageSrc,
  imageGuid,
  userId,
  refreshUserData,
  userDataLoading,
  name,
  editable,
  size = 150,
  annotations,
  square = false,
  chipLabel,
}) {
  const theme = useTheme();
  const [avatarHovered, setAvatarHovered] = useState(false);
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
          refreshUserData={refreshUserData}
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
          <svg
            style={{
              position: 'absolute',
              left: 1,
              top: 1,
              width: size,
              height: size,
              opacity: avatarHovered ? 1 : 0,
            }}
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
            onClick={() => setEditingAvatar(true)}
          >
            <defs>
              <clipPath id="cut-off-top">
                <rect
                  x={0}
                  y={0.5 * size}
                  width={size}
                  height={0.5 * size}
                />
              </clipPath>
            </defs>
            {square ? (
              <rect
                x={0}
                y={75}
                width={150}
                height={60}
                fill="rgba(0, 0, 0, 0.5)"
                clipPath="url(#cut-off-top)"
              />
            ) : (
              <ellipse
                cx={0.5 * size}
                cy={0.5 * size}
                rx={0.5 * size}
                ry={0.5 * size}
                fill="rgba(0, 0, 0, 0.5)"
                clipPath="url(#cut-off-top)"
              />
            )}
            <SvgText x={75} y={110} fill="white">
              <FormattedMessage id="CHANGE_PHOTO" />
            </SvgText>
          </svg>
        )}
      </div>
    </div>
  );
}
