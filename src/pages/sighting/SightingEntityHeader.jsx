import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get, map } from 'lodash-es';

import timePrecisionMap from '../../constants/timePrecisionMap';
import defaultSightingSrc from '../../assets/defaultSighting.png';
import Link from '../../components/Link';
import Tabs from '../../components/Tabs';
import Text from '../../components/Text';
import MoreMenu from '../../components/MoreMenu';
import EntityHeader from '../../components/EntityHeader';
import { formatDateCustom } from '../../utils/formatters';
import FeaturedPhoto from '../../components/FeaturedPhoto';

const tabItems = [
  {
    labelId: 'OVERVIEW',
    value: 'overview',
  },
  {
    labelId: 'PHOTOGRAPHS',
    value: 'photographs',
  },
  {
    labelId: 'ANNOTATIONS',
    value: 'annotations',
  },
  {
    labelId: 'ANIMALS',
    value: 'individuals',
  },
];

export default function SightingEntityHeader({
  activeTab,
  data,
  loading,
  pending,
  guid,
  setHistoryOpen,
  setDeleteDialogOpen,
})
{
  const intl = useIntl();

  const dataForFeaturedPhoto = useMemo(
    () =>
    {
      const assets = get(data, ['assets'], []);
      const modifiedAssets = map(
        assets,
        asset =>
        {
          return { ...asset, altText: asset?.filename };
        },
        [],
      );
      return {
        ...data,
        assets: modifiedAssets,
      };
    },
    [data],
  );

  const sightingTime = data?.time;
  const sightingTimeSpecificity = data?.timeSpecificity;
  const formatSpecification = get(
    timePrecisionMap,
    [sightingTimeSpecificity, 'prettyFormat'],
    'yyyy-MM-dd',
  );
  const sightingDisplayDate = formatDateCustom(
    sightingTime,
    formatSpecification,
  );

  const sightingCreator = data?.creator;
  const creatorName =
    sightingCreator?.full_name ||
    intl.formatMessage({ id: 'UNNAMED_USER' });
  const creatorUrl = `/users/${sightingCreator?.guid}`;

  return (
    <EntityHeader
      renderAvatar={
        <FeaturedPhoto
          data={pending ? null : dataForFeaturedPhoto}
          loading={loading}
          defaultPhotoSrc={defaultSightingSrc}
          sightingId={data?.guid}
        />
      }
      name={intl.formatMessage(
        { id: 'ENTITY_HEADER_SIGHTING_DATE' },
        { date: sightingDisplayDate },
      )}
      renderTabs={
        <Tabs
          value={activeTab.replace('#', '')}
          onChange={(_, newValue) =>
          {
            window.location.hash = newValue;
          }}
          items={tabItems}
        />
      }
      renderOptions={
        <div style={{ display: 'flex' }}>
          {/* <Button id="SUBSCRIBE" display="primary" /> */}
          <MoreMenu
            menuId="sighting-actions"
            items={[
              {
                id: 'view-history',
                onClick: () => setHistoryOpen(true),
                label: 'View history',
              },
              {
                id: 'delete-sighting',
                onClick: () => setDeleteDialogOpen(true),
                label: 'Delete sighting',
              },
            ]}
          />
        </div>
      }
    >
      {sightingCreator && (
        <Text variant="body2">
          {intl.formatMessage({ id: 'REPORTED_BY' })}
          <Link to={creatorUrl}>{creatorName}</Link>
        </Text>
      )}
    </EntityHeader>
  );
}
