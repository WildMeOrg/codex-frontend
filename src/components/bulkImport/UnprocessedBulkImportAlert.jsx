import React from 'react';
import { get } from 'lodash-es';

import CustomAlert from '../Alert';

import useAssetGroup from '../../models/assetGroup/useAssetGroup';
import ButtonLink from '../ButtonLink';
import { formatDate } from '../../utils/formatters';

export default function UnprocessedBulkImportAlert({
  unprocessedAssetGroupId,
}) {
  const { data: assetGroupData } = useAssetGroup(
    unprocessedAssetGroupId,
  );

  if (!assetGroupData) return null;

  const sightingCount = get(assetGroupData, [
    'asset_group_sightings',
    'length',
  ]);
  const date = get(assetGroupData, 'created');
  const id = get(assetGroupData, 'guid');
  const formattedDate = formatDate(date, true);
  return (
    <CustomAlert
      titleId="PENDING_BULK_IMPORT"
      descriptionId="PENDING_BULK_IMPORT_MESSAGE"
      descriptionValues={{ sightingCount, date: formattedDate }}
      style={{ margin: '12px 16px' }}
      action={
        <ButtonLink
          style={{ marginTop: 12 }}
          display="basic"
          size="small"
          id="VIEW"
          href={`/bulk-imports/${id}`}
        />
      }
      severity="info"
    />
  );
}
