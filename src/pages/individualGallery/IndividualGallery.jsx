import React from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { capitalize, pick, transform } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useIndividual from '../../models/individual/useIndividual';
import { deriveIndividualName } from '../../utils/nameUtils';
import errorTypes from '../../constants/errorTypes';
import Button from '../../components/Button';
import Link from '../../components/Link';
import LoadingScreen from '../../components/LoadingScreen';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
import Text from '../../components/Text';
import GalleryItem from './components/GalleryItem';

function transformToAssets(individualData) {
  if (!individualData?.encounters) return [];

  const dataByAsset = transform(
    individualData.encounters,
    (memo, encounter) => {
      // Each asset needs information from the annotation that it belongs to.
      // Every encounter annotation will be used, but multiple annotations may have the same asset.
      if (encounter?.annotations) {
        encounter.annotations.forEach(annotation => {
          const annotationData = pick(annotation, ['guid', 'bounds']);
          const assetGuid = annotation?.asset_guid;

          if (assetGuid) {
            if (!memo[assetGuid]) {
              const assetMetadata = { src: annotation.asset_src };

              memo[assetGuid] = {
                guid: assetGuid,
                metadata: assetMetadata,
                annotations: [],
              };
            }
            memo[assetGuid].annotations.push(annotationData);
          }
        });
      }

      return memo;
    },
    {},
  );

  return Object.values(dataByAsset);
}

export default function IndividualGallery() {
  const intl = useIntl();
  const theme = useTheme();
  const { guid } = useParams();

  const { data, statusCode, loading, error } = useIndividual(guid);

  const galleryAssets = transformToAssets(data);
  const gridColumnWidth = 300;

  const name = deriveIndividualName(
    data,
    'FirstName',
    intl.formatMessage({ id: 'UNNAMED_INDIVIDUAL' }),
  );

  useDocumentTitle('INDIVIDUAL_GALLERY_TITLE', {
    messageValues: { name: capitalize(name) },
    refreshKey: name,
  });

  if (error) {
    return (
      <SadScreen
        statusCode={statusCode}
        variantOverrides={{
          [errorTypes.notFound]: {
            subtitleId: 'INDIVIDUAL_NOT_FOUND',
            descriptionId: 'INDIVIDUAL_NOT_FOUND_DESCRIPTION',
          },
        }}
      />
    );
  }

  if (loading) return <LoadingScreen />;

  return (
    <MainColumn style={{ maxWidth: theme.breakpoints.values.xl }}>
      <Button
        display="back"
        id="INDIVIDUAL_BACK_TO_PROFILE"
        values={{ name }}
        style={{ marginTop: 8 }}
        component={Link}
        to={`/individuals/${guid}`}
        noUnderline
      />
      <Text
        variant="h3"
        style={{ padding: '4px 0 16px 16px' }}
        id="PHOTOS_OF"
        values={{ name }}
      />
      <ul
        style={{
          listStyle: 'none',
          display: 'grid',
          gap: '24px 12px',
          padding: '0 16px',
          justifyContent: 'center',
          gridTemplateColumns: `repeat(auto-fit, ${gridColumnWidth}px)`,
        }}
      >
        {galleryAssets.map(galleryAsset => (
          <GalleryItem
            key={galleryAsset.guid}
            {...galleryAsset}
            width={gridColumnWidth}
          />
        ))}
      </ul>
    </MainColumn>
  );
}
