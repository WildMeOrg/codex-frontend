import React, { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { get, map } from 'lodash-es';

import Skeleton from '@material-ui/lab/Skeleton';

import ReviewSighting from '../../components/dialogs/ReviewSighting';
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
  setActiveTab,
}) {
  const intl = useIntl();
  const [matchStatus, setMatchStatus] = useState(null);
  useEffect(() => {
    if (data) {
      setMatchStatus(data.match_state);
    }
  }, [data?.match_state]);

  const [rerunDialogOpen, setRerunDialogOpen] = useState(false);

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
                setActiveTab(`#${newValue}`);
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
                // {
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
        <ReviewSighting
          matchStatus={matchStatus}
          sightingGuid={guid}
        />
      </EntityHeader>
    </>
  );
}
