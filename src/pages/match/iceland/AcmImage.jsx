import React, { useRef, useState } from 'react';
import { get } from 'lodash-es';
import { format, parseISO } from 'date-fns';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useDimensions from '../../../hooks/useDimensions';

function getAnnotationZoomData(annotation) {
  const bbox = get(annotation, [
    'asset',
    'features',
    '0',
    'parameters',
  ]);
  const imageHeight = get(annotation, [
    'asset',
    'metadata',
    'height',
  ]);
  const imageWidth = get(annotation, ['asset', 'metadata', 'width']);
  const pctHeight = bbox.height / imageHeight;
  const pctWidth = bbox.width / imageWidth;

  const largestDimension = Math.max(pctWidth, pctHeight);
  const scale = 1 / (largestDimension + 0.05);

  const centerX = 100 * (bbox.x / imageWidth + 0.5 * pctWidth);
  const centerY = 100 * (bbox.y / imageHeight + 0.5 * pctHeight);

  return {
    tx: 50 - centerX,
    ty: 50 - centerY,
    scale,
  };
}

export default function AcmImage({
  annotation,
  style = {},
  locationId,
  dateString,
  children,
  ...rest
}) {
  const theme = useTheme();

  const containerRef = useRef(null);
  const { width } = useDimensions(containerRef);
  const [zoomed, setZoomed] = useState(true);
  const [zoomData, setZoomData] = useState(
    getAnnotationZoomData(annotation),
  );

  const imageHeight = get(annotation, [
    'asset',
    'metadata',
    'height',
  ]);
  const imageWidth = get(annotation, ['asset', 'metadata', 'width']);
  const date = get(annotation, ['asset', 'dateTime']);
  const formattedDate = date ? format(parseISO(date), 'M/dd/yy') : '';
  const imageUrl = get(annotation, ['asset', 'url']);
  const displayName = get(annotation, [
    'asset',
    'features',
    '0',
    'displayName',
  ]);
  const filename = get(annotation, ['asset', 'filename']);

  const svgHeight = (width * imageHeight) / imageWidth;

  function getRectProperties(annot, currentlyZoomed) {
    const bbox = get(annot, ['asset', 'features', '0', 'parameters']);

    return {
      x: `${(100 * bbox.x) / imageWidth}%`,
      y: `${(100 * bbox.y) / imageHeight}%`,
      width: `${(100 * bbox.width) / imageWidth}%`,
      height: `${(100 * bbox.height) / imageHeight}%`,
      cursor: currentlyZoomed ? 'zoom-out' : 'zoom-in',
      fill: 'transparent',
      onClick: () => {
        if (currentlyZoomed) {
          setZoomed(false);
        } else {
          setZoomed(true);
          setZoomData(getAnnotationZoomData(annot));
        }
      },
    };
  }

  return (
    <div
      ref={containerRef}
      style={{ margin: 16, width: '100%', ...style }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 4,
        }}
      >
        <Typography variant="subtitle1">{filename}</Typography>
      </div>
      <div
        style={{
          overflow: 'hidden',
          lineHeight: 0,
          position: 'relative',
          backgroundColor: 'dimgrey',
        }}
      >
        <svg
          style={{
            transform: zoomed
              ? `scale(${zoomData.scale})`
              : 'scale(1)',
            transition: 'transform 0.2s ease-in-out',
            cursor: zoomed ? 'zoom-out' : 'unset',
          }}
          width={width}
          height={svgHeight}
          transform="scale(1)"
        >
          <g
            style={{
              transform: zoomed
                ? `translate(${zoomData.tx}%, ${zoomData.ty}%)`
                : 'translate(0, 0)',
              transition: 'transform 0.2s ease-in-out',
            }}
          >
            <image
              onClick={() => {
                if (zoomed) setZoomed(false);
              }}
              href={imageUrl}
              width={width}
              height={svgHeight}
            />
            <rect
              {...getRectProperties(annotation, zoomed)}
              strokeWidth={10}
              stroke={theme.palette.common.white}
            />
            <rect
              {...getRectProperties(annotation, zoomed)}
              strokeWidth={4}
              stroke={theme.palette.common.black}
            />
          </g>
        </svg>
        {children}
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography>{displayName}</Typography>
        <Typography>{formattedDate}</Typography>
      </div>
    </div>
  );
}
