import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';
import SvgText from '../../../components/SvgText';
import defaultProfilePhotoSrc from '../../../assets/defaultProfile.jpg';
import FeaturedPhotoSelector from './FeaturedPhotoSelector';

export default function FeaturedPhoto({
  data,
  loading,
  // refreshSightingData,
  defaultPhotoSrc = defaultProfilePhotoSrc,
  size = 150,
}) {
  console.log('deleteMe data is: ');
  console.log(data);
  const intl = useIntl();
  const theme = useTheme();
  const [hovered, setHovered] = useState(false);
  const [
    selectingFeaturedPhoto,
    setSelectingFeaturedPhoto,
  ] = useState(false);
  const assets = get(data, 'assets', []);
  const editable = assets.length > 1;
  const featuredPhotoGuid = get(data, ['featuredAssetGuid']);
  console.log('deleteMe assets are: ');
  console.log(assets);
  const featuredPhoto = assets.find(
    a => a.guid === featuredPhotoGuid,
  );
  const featuredPhotoSrc = get(featuredPhoto, 'src');
  const deleteMeDataNotFromIndividual = !data?.isFromIndividual;
  console.log(
    'deleteMe deleteMeDataNotFromIndividual is: ' +
      deleteMeDataNotFromIndividual,
  );
  console.log('deleteMe get(data, id) is: ');
  console.log(get(data, 'id'));

  return (
    <div
      style={{
        position: 'relative',
        border: `1px solid ${theme.palette.grey['500']}`,
        overflow: 'hidden',
        cursor: editable ? 'pointer' : 'unset',
      }}
    >
      <FeaturedPhotoSelector
        currentFeaturedPhotoId={featuredPhotoGuid}
        sightingId={!data?.isFromIndividual ? get(data, 'id') : null}
        individualId={data?.isFromIndividual ? get(data, 'id') : null}
        assets={assets}
        open={selectingFeaturedPhoto}
        // refreshSightingData={refreshSightingData}
        onClose={() => setSelectingFeaturedPhoto(false)}
      />
      {loading ? (
        <div style={{ width: size, height: size }} />
      ) : (
        <img
          src={featuredPhotoSrc || defaultPhotoSrc}
          alt={intl.formatMessage({ id: 'FEATURED_ASSET' })}
          style={{
            objectFit: 'cover',
            width: size,
            height: size,
            display: 'block',
          }}
        />
      )}
      {editable && (
        <svg
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
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
