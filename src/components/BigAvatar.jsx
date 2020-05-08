import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import SvgText from './SvgText';
import EditAvatar from './EditAvatar';

export default function BigAvatar({
  imgSrc,
  name,
  editable,
  size = 150,
  square = false,
}) {
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: '50%',
        cursor: editable ? 'pointer' : 'unset',
      }}
    >
      <EditAvatar
        visible={editingAvatar}
        square={square}
        onClose={() => setEditingAvatar(false)}
      />
      <img
        src={imgSrc}
        alt={`Profile for ${name}`}
        style={{
          width: size,
          height: size,
          borderRadius: square ? 'unset' : '50%',
          border: '1px solid #ccc',
        }}
      />
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
              <rect x={0} y={0.5 * size} width={size} height={0.5 * size} />
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
  );
}
