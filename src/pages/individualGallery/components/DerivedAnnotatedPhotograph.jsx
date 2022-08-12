import React, { useState } from 'react';
import { get } from 'lodash-es';

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
  const isClamped = isAssetImageClamped({ imageWidth, imageHeight });

  if (imageWidth && imageHeight && !isClamped) {
    return (
      <AnnotatedPhotograph
        {...props}
        assetMetadata={{
          ...props.assetMetadata,
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
            descriptionId="ERROR_FETCHING_IMAGE"
          />
        )}
        {!isError && assetSrc && (
          <img
            src={assetSrc}
            alt={props.assetMetadata?.alt}
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
