import React, { useState } from 'react';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';

import AnnotatedPhotograph from '../../../components/AnnotatedPhotograph';

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

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          width,
          height,
          background: theme.palette.grey['600'],
        }}
      >
        {assetSrc && (
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
          />
        )}
      </div>
    </div>
  );
}
