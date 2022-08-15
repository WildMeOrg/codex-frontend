import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { capitalize } from 'lodash-es';

import { useTheme } from '@material-ui/core/styles';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useIndividual from '../../models/individual/useIndividual';
import { deriveIndividualName } from '../../utils/nameUtils';
import errorTypes from '../../constants/errorTypes';
import CustomAlert from '../../components/Alert';
import Button from '../../components/Button';
import Link from '../../components/Link';
import LoadingScreen from '../../components/LoadingScreen';
import MainColumn from '../../components/MainColumn';
import SadScreen from '../../components/SadScreen';
import Text from '../../components/Text';
import GalleryItem from './components/GalleryItem';

const gridColumnWidth = 300;

function transformToAssets(individualData) {
  if (!individualData?.encounters) return [];

  const dataByAsset = individualData.encounters.reduce(
    (memo, encounter) => {
      const sharedEncounterData = {
        owner: {
          guid: encounter?.owner?.guid,
          fullName: encounter?.owner?.full_name,
        },
        time: {
          time: encounter?.time,
          timeSpecificity: encounter?.timeSpecificity,
        },
        location: {
          label: encounter?.locationId_value,
          decimalLatitude: encounter?.decimalLatitude,
          decimalLongitude: encounter?.decimalLongitude,
        },
      };

      // Each asset needs information from the annotation that it belongs to.
      // Every encounter annotation will be used, but multiple annotations may have the same asset.
      if (encounter?.annotations) {
        encounter.annotations.forEach(annotation => {
          const {
            guid,
            bounds,
            ia_class: iAClass,
          } = annotation || {};
          const annotationData = { guid, bounds, iAClass };
          const assetGuid = annotation?.asset_guid;

          if (assetGuid) {
            if (!memo[assetGuid]) {
              const assetMetadata = { src: annotation.asset_src };

              memo[assetGuid] = {
                guid: assetGuid,
                metadata: assetMetadata,
                annotations: [],
                ...sharedEncounterData,
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

  const galleryAssets = useMemo(
    () => transformToAssets(data),
    [data],
  );

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
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: `repeat(auto-fit, ${gridColumnWidth}px)`,
          margin: '0 16px 16px 16px',
        }}
      >
        <CustomAlert
          style={{ gridColumn: '1 / -1' }}
          severity="info"
          descriptionId="INDIVIDUAL_GALLERY_UNABLE_TO_DISPLAY_ANNOTATIONS"
        />
      </div>
      <ul
        style={{
          listStyle: 'none',
          display: 'grid',
          gap: '24px 12px',
          padding: '0 16px',
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
