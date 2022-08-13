import React, { useState } from 'react';
import { get, uniq } from 'lodash-es';
import { useIntl } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';

import AnnotatedPhotograph from '../../../components/AnnotatedPhotograph';
import CustomAlert from '../../../components/Alert';

const assetFormats = {
  master: [4096, 4096],
};

function isAssetImageClamped({ imageWidth, imageHeight }) {
  return (
    imageWidth === assetFormats.master[0] ||
    imageHeight === assetFormats.master[1]
  );
}

export default function DerivedAnnotatedPhotograph(props) {
  const theme = useTheme();
  const intl = useIntl();
  const [isError, setIsError] = useState(false);
  const [{ imageWidth, imageHeight }, setImageDimensions] = useState(
    {},
  );

  function handleImageLoad(e) {
    const { naturalWidth, naturalHeight } = e.target;

    if (naturalWidth && naturalHeight) {
      setImageDimensions({
        imageWidth: naturalWidth,
        imageHeight: naturalHeight,
      });
    }
  }

  const width = get(props, 'width', 300);
  const height = get(props, 'height', width);
  const assetSrc = get(props, 'assetMetadata.src');
  const annotations = get(props, 'annotations') || [];
  const uniqueAssetClasses = uniq(
    annotations.map(annotation => annotation?.iAClass),
  );
  const isClamped = isAssetImageClamped({ imageWidth, imageHeight });

  const altText = intl.formatMessage(
    { id: 'INDIVIDUAL_GALLERY_IMAGE_ALT' },
    {
      annotationCount: annotations.length,
      assetClassCount: uniqueAssetClasses.length,
      assetClassesList: intl.formatList(uniqueAssetClasses, {
        type: 'conjunction',
      }),
    },
  );

  if (imageWidth && imageHeight && !isClamped) {
    return (
      <AnnotatedPhotograph
        {...props}
        assetMetadata={{
          ...props.assetMetadata,
          alt: altText,
          dimensions: { width: imageWidth, height: imageHeight },
        }}
      />
    );
  }

  const imageCardStyles = {
    width,
    height,
    background: theme.palette.grey['600'],
  };

  const errorCardStyles = {
    ...imageCardStyles,
    padding: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={isError ? errorCardStyles : imageCardStyles}>
        {isError && (
          <CustomAlert
            severity="error"
            titleId="ERROR_FETCHING_IMAGE"
            description={altText}
          />
        )}
        {!isError && assetSrc && (
          <img
            src={assetSrc}
            alt={altText}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'scale-down',
            }}
            onLoad={handleImageLoad}
            onError={() => setIsError(true)}
          />
        )}
      </div>
    </div>
  );
}
