import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { get, map } from 'lodash-es';

import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import Skeleton from '@material-ui/lab/Skeleton';

import ReviewSightingDialog from '../../components/dialogs/ReviewSightingDialog';
import FormattedReporter from '../../components/formatters/FormattedReporter';
import Tabs from '../../components/Tabs';
import MoreMenu from '../../components/MoreMenu';
import EntityHeader from '../../components/EntityHeader';
import FeaturedPhoto from '../../components/FeaturedPhoto';
import { formatDateCustom } from '../../utils/formatters';
import timePrecisionMap from '../../constants/timePrecisionMap';
import defaultSightingSrc from '../../assets/defaultSighting.png';
import RerunIdentificationDialog from './identification/RerunIdentificationDialog';

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
  preparing,
  guid,
  // setHistoryOpen,
  setDeleteDialogOpen,
}) {
  const intl = useIntl();

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rerunDialogOpen, setRerunDialogOpen] = useState(false);

  const sightingIsReviewed = Boolean(data?.review_time);

  const dataForFeaturedPhoto = useMemo(() => {
    const assets = get(data, ['assets'], []);
    const modifiedAssets = map(
      assets,
      asset => ({ ...asset, altText: asset?.filename }),
      [],
    );
    return {
      ...data,
      assets: modifiedAssets,
    };
  }, [data]);

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

  return (
    <>
      <ReviewSightingDialog
        sightingGuid={guid}
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
      />
      <RerunIdentificationDialog
        sightingGuid={guid}
        open={rerunDialogOpen}
        onClose={() => setRerunDialogOpen(false)}
      />
      <EntityHeader
        renderAvatar={
          preparing ? (
            <Skeleton height={150} width={150} variant="rect" />
          ) : (
            <FeaturedPhoto
              data={pending ? null : dataForFeaturedPhoto}
              loading={loading}
              defaultPhotoSrc={defaultSightingSrc}
              sightingId={data?.guid}
            />
          )
        }
        name={intl.formatMessage(
          { id: 'ENTITY_HEADER_SIGHTING_DATE' },
          { date: sightingDisplayDate },
        )}
        renderTabs={
          preparing ? (
            <div />
          ) : (
            <Tabs
              value={activeTab.replace('#', '')}
              onChange={(_, newValue) => {
                window.location.hash = newValue;
              }}
              items={tabItems}
            />
          )
        }
        renderOptions={
          <div style={{ display: 'flex' }}>
            {/* <Button id="SUBSCRIBE" display="primary" /> */}
            <MoreMenu
              menuId="sighting-actions"
              items={[
                // {
                //   id: 'view-history',
                //   onClick: () => setHistoryOpen(true),
                //   label: 'View history',
                // },
                {
                  id: 'mark-reviewed',
                  onClick: () => setReviewDialogOpen(true),
                  disabled: pending || sightingIsReviewed,
                  label: 'Mark sighting reviewed',
                },
                {
                  id: 'rerun-identification',
                  onClick: () => setRerunDialogOpen(true),
                  disabled: pending,
                  label: 'Re-run identification',
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
          <FormattedReporter
            variant="body2"
            reporter={{
              guid: sightingCreator.guid,
              fullName: sightingCreator.full_name,
            }}
          />
        )}
        {sightingIsReviewed && (
          <Chip
            icon={<DoneIcon />}
            variant="outlined"
            label="Reviewed"
            style={{ marginTop: 8 }}
          />
        )}
      </EntityHeader>
    </>
  );
}
