import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';
import SvgText from './SvgText';
import EditAvatar from './EditAvatar';

export default function BigAvatar({
  imgSrc,
  name,
  editable,
  size = 150,
  annotations,
  square = false,
  admin = false,
}) {
  const theme = useTheme();
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
          width: size + 1,
          height: size + 1,
          borderRadius: square ? 'unset' : '50%',
          border: `1px solid ${theme.palette.grey['400']}`,
        }}
      />
      {admin && (
        <svg
          style={{
            position: 'absolute',
            left: 1,
            top: 1,
            width: size,
            height: size,
          }}
        >
          <rect
            x={size * 0.1}
            y={size * 0.8}
            width={size * 0.8}
            height={24}
            fill={theme.palette.primary.light}
            rx={4}
          />
          <SvgText
            x={size * 0.5}
            y={size * 0.8 + 17}
            fill={theme.palette.common.black}
          >
            Admin
          </SvgText>
        </svg>
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
  );
}
