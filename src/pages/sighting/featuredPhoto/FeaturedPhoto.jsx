import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import SvgText from '../../../components/SvgText';
import defaultProfilePhoto from '../../../assets/defaultProfile.jpg';
import FeaturedPhotoSelector from './FeaturedPhotoSelector';

export default function FeaturedPhoto({
  assets,
  loading,
  editable,
  size = 150,
}) {
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);
  const [
    selectingFeaturedPhoto,
    setSelectingFeaturedPhoto,
  ] = useState(false);
  const featuredPhoto = get(assets, ['0']);
  const imageSrc = get(featuredPhoto, 'src');

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
      <FeaturedPhotoSelector
        currentFeaturedPhotoId={get(featuredPhoto, 'guid')}
        assets={assets}
        open={selectingFeaturedPhoto}
        onClose={() => setSelectingFeaturedPhoto(false)}
      />
      {loading ? (
        <div
          style={{
            // width: size + 1,
            // height: size + 1,
            width: size,
            height: size,
            border: `1px solid ${theme.palette.grey['400']}`,
          }}
        />
      ) : (
        <img
          src={imageSrc || defaultProfilePhoto}
          alt="Featured asset"
          style={{
            objectFit: 'cover',
            width: size + 1,
            height: size + 1,
            border: `1px solid ${theme.palette.grey['400']}`,
          }}
        />
      )}
      {editable && (
        <svg
          style={{
            position: 'absolute',
            left: 1,
            top: 1,
            width: size,
            height: size,
            opacity: hovered ? 1 : 0,
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setSelectingFeaturedPhoto(true)}
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
          <rect
            x={0}
            y={75}
            width={150}
            height={75}
            fill="rgba(0, 0, 0, 0.6)"
            clipPath="url(#cut-off-top)"
          />
          <SvgText x={75} y={115} fill="white">
            <FormattedMessage id="CHANGE_PHOTO" />
          </SvgText>
        </svg>
      )}
    </div>
  );
}
