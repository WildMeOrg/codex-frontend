import React, { useRef, useState, useEffect } from 'react';
import { get } from 'lodash-es';
import { format, parseISO } from 'date-fns';
import { useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Link from '../../../components/Link';
import useDimensions from '../../../hooks/useDimensions';
import { getFeature } from './utils';

const noTransform = {
  scale: 1,
  tx: 50,
  ty: 50,
};

function shouldZoom(annotation) {
  if (!annotation) return false;
  const bbox = getFeature(annotation, 'parameters');
  const imageHeight = get(annotation, [
    'asset',
    'metadata',
    'height',
  ]);
  const imageWidth = get(annotation, ['asset', 'metadata', 'width']);

  const insufficientData = !(bbox && imageWidth && imageHeight);
  if (insufficientData) return false;
  if (bbox.width > 0.8 * imageWidth) return false;
  if (bbox.height > 0.8 * imageHeight) return false;
  return true;
}

function getAnnotationZoomData(annotation, allowZoom) {
  const bbox = getFeature(annotation, 'parameters');
  const imageHeight = get(annotation, [
    'asset',
    'metadata',
    'height',
  ]);
  const imageWidth = get(annotation, ['asset', 'metadata', 'width']);

  const insufficientData = !(bbox && imageHeight && imageWidth);
  if (!allowZoom || insufficientData) return noTransform;

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
  renderTitleButton = () => null,
  children,
  ...rest
}) {
  const theme = useTheme();

  const containerRef = useRef(null);
  const { width } = useDimensions(containerRef);
  const [zoomEnabled, setZoomEnabled] = useState(null);
  const [zoomed, setZoomed] = useState(null);
  const [zoomData, setZoomData] = useState(null);

  useEffect(
    () => {
      if (!annotation) {
        setZoomEnabled(null);
        setZoomed(null);
        setZoomData(null);
      } else {
        const enableZoom = shouldZoom(annotation);
        setZoomEnabled(enableZoom);
        setZoomed(enableZoom); // later we will only do this if there is only one annotation
        setZoomData(getAnnotationZoomData(annotation, enableZoom));
      }
    },
    [get(annotation, 'id')],
  );

  if (!annotation) return null;

  const imageHeight = get(annotation, [
    'asset',
    'metadata',
    'height',
  ]);
  const imageWidth = get(annotation, ['asset', 'metadata', 'width']);
  const date = get(annotation, ['asset', 'dateTime']);
  const formattedDate = date
    ? format(parseISO(date), 'MMMM d, yyyy')
    : '';
  const imageUrl = get(annotation, ['asset', 'url']);

  const displayName = getFeature(annotation, 'displayName');
  const individualId = getFeature(annotation, 'individualId');
  const encounterId = getFeature(annotation, 'encounterId');

  const filename = get(annotation, ['asset', 'filename']);

  const svgHeight = (width * imageHeight) / imageWidth;

  function getRectProperties(annot, currentlyZoomed, allowZoom) {
    const bbox = getFeature(annot, 'parameters');

    if (!bbox) return null;

    const baseProperties = {
      x: `${(100 * bbox.x) / imageWidth}%`,
      y: `${(100 * bbox.y) / imageHeight}%`,
      width: `${(100 * bbox.width) / imageWidth}%`,
      height: `${(100 * bbox.height) / imageHeight}%`,
      fill: 'transparent',
    };

    if (!allowZoom) return baseProperties;

    return {
      ...baseProperties,
      cursor: currentlyZoomed ? 'zoom-out' : 'zoom-in',
      onClick: () => setZoomed(!currentlyZoomed),
    };
  }

  const rectProperties = getRectProperties(
    annotation,
    zoomed,
    zoomEnabled,
  );

  return (
    <div
      ref={containerRef}
      style={{ margin: 16, width: '100%', flexGrow: 1, ...style }}
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
        <Typography variant="h6">
          {displayName ? (
            <Link
              href={`https://www.flukebook.org/individuals.jsp?id=${individualId}`}
              external
              newTab
            >
              {displayName}
            </Link>
          ) : (
            'Unassigned'
          )}
        </Typography>
        {renderTitleButton()}
      </div>
      <Tooltip title={filename}>
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
              {rectProperties && (
                <rect
                  {...rectProperties}
                  strokeWidth={zoomed ? 4 / zoomData.scale : 4}
                  stroke={theme.palette.common.black}
                />
              )}
            </g>
          </svg>
          {children}
        </div>
      </Tooltip>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography>
          <Link
            external
            newTab
            href={`https://www.flukebook.org/encounters/encounter.jsp?number=${encounterId}`}
          >
            {formattedDate
              ? `Observed ${formattedDate}`
              : 'View sighting'}
          </Link>
        </Typography>
      </div>
    </div>
  );
}
