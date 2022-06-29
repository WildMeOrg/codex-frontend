import React from 'react';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SelectedIcon from '@material-ui/icons/CheckCircle';
import SelectableIcon from '@material-ui/icons/AddCircle';

export default function AnnotatedPhotograph({
  assetMetadata,
  width = 300,
  height,
  annotations = [],
  selectable = false,
  selected = false,
  onClick,
}) {
  const theme = useTheme();

  const alt = get(assetMetadata, 'alt');
  const src = get(assetMetadata, 'src');
  const imageWidth = get(assetMetadata, ['dimensions', 'width']);
  const imageHeight = get(assetMetadata, ['dimensions', 'height']);

  const showSelectableIcon = selectable && !selected;

  return (
    /* eslint-disable */
    /* This needs a11y support, created DEX-1266 to track */
    <div
      onClick={onClick}
      role="button"
      style={{
        background: theme.palette.grey['600'],
        position: 'relative',
        width,
      }}
    >
      /* eslint-enable */
      {showSelectableIcon && (
        <IconButton
          aria-label="select annotation"
          style={{
            position: 'absolute',
            color: theme.palette.common.white,
            zIndex: 1,
          }}
        >
          <SelectableIcon />
        </IconButton>
      )}
      {selected && (
        <IconButton
          aria-label="deselect annotation"
          style={{
            position: 'absolute',
            color: theme.palette.primary.main,
            zIndex: 1,
          }}
        >
          <SelectedIcon />
        </IconButton>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width,
          height: height || width, // fall back to height=width;
          cursor: onClick ? 'pointer' : undefined,
          background: theme.palette.grey['600'],
          transform: selected
            ? 'translateZ(0px) scale3d(0.89, 0.85, 1)'
            : undefined,
          transition: selectable
            ? 'transform .135s cubic-bezier(0,0,.2,1)'
            : undefined,
          display: 'block',
        }}
        viewBox={`0 0 ${imageWidth} ${imageHeight}`}
        preserveAspectRatio="xMidYMid meet"
        width={width}
      >
        <image
          alt={alt}
          href={src}
          x={0}
          y={0}
          height="100%"
          width="100%"
        />
        {annotations.map(annotation => {
          const x = get(annotation, ['bounds', 'rect', '0']);
          const y = get(annotation, ['bounds', 'rect', '1']);
          const w = get(annotation, ['bounds', 'rect', '2']);
          const h = get(annotation, ['bounds', 'rect', '3']);
          const theta = get(annotation, ['bounds', 'theta'], 0);

          if (!annotation) return null;

          return (
            <rect
              key={get(annotation, 'guid')}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transform: `rotate(${theta}rad)`,
              }}
              fill="none"
              // stroke={theme.palette.common.black}
              stroke="#ff952c"
              strokeWidth={6}
              vectorEffect="non-scaling-stroke"
              x={x}
              y={y}
              width={w}
              height={h}
            />
          );
        })}
      </svg>
    </div>
  );
}
