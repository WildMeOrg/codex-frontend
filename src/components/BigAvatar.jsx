import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import SvgText from './SvgText';
import EditAvatar from './EditAvatar';

export default function BigAvatar({ imgSrc, name, editable }) {
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [editingAvatar, setEditingAvatar] = useState(false);

  return (
    <div
      style={{
        width: 150,
        height: 150,
        position: 'relative',
        marginLeft: 12,
        borderRadius: '50%',
        cursor: editable ? 'pointer' : 'unset',
      }}
    >
      <EditAvatar
        visible={editingAvatar}
        onClose={() => setEditingAvatar(false)}
      />
      <img
        src={imgSrc}
        alt={`Profile for ${name}`}
        style={{
          width: 150,
          height: 150,
          borderRadius: '50%',
          border: '1px solid #ccc',
        }}
      />
      {editable && (
        <svg
          style={{
            position: 'absolute',
            left: 1,
            top: 1,
            width: 150,
            height: 150,
            opacity: avatarHovered ? 1 : 0,
          }}
          onMouseEnter={() => setAvatarHovered(true)}
          onMouseLeave={() => setAvatarHovered(false)}
          onClick={() => setEditingAvatar(true)}
        >
          <defs>
            <clipPath id="cut-off-top">
              <rect x={0} y={75} width={150} height={75} />
            </clipPath>
          </defs>
          <ellipse
            cx={75}
            cy={75}
            rx={75}
            ry={75}
            fill="rgba(0, 0, 0, 0.5)"
            clipPath="url(#cut-off-top)"
          />
          <SvgText x={75} y={110} fill="white">
            <FormattedMessage id="CHANGE_PHOTO" />
          </SvgText>
        </svg>
      )}
    </div>
  );
}
