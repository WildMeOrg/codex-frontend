import React from 'react';
import { get } from 'lodash-es';
import { useTheme } from '@material-ui/core/styles';

export default function AnnotatedPhotograph({
  assetMetadata,
  width = 300,
  annotations = [],
  onClick,
}) {
  const theme = useTheme();

  const alt = get(assetMetadata, 'alt');
  const src = get(assetMetadata, 'src');
  const imageWidth = get(assetMetadata, ['dimensions', 'width']);
  const imageHeight = get(assetMetadata, ['dimensions', 'height']);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width,
        height: width,
        cursor: 'pointer',
        background: theme.palette.grey['500'],
      }}
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      preserveAspectRatio="xMidYMid meet"
      width={width}
      onClick={onClick}
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
            stroke={theme.palette.common.black}
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
  );
}
