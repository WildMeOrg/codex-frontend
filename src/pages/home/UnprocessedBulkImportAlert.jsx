import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';

import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import Button from '../../components/Button';
import { formatDate } from '../../utils/formatters';

export default function UnprocessedBulkImportAlert({
  assetGroupData,
}) {
  const sightingCount = get(assetGroupData, ['sightings', 'length']);
  const date = get(assetGroupData, 'created');
  const formattedDate = formatDate(date);
  return (
    <Alert
      style={{ margin: '12px 16px' }}
      action={
        <Button
          style={{ marginTop: 12 }}
          display="basic"
          size="small"
          id="VIEW"
        />
      }
      severity="info"
    >
      <AlertTitle>
        <FormattedMessage id="PENDING_BULK_IMPORT" />
      </AlertTitle>
      <FormattedMessage
        id="PENDING_BULK_IMPORT_MESSAGE"
        values={{ sightingCount, date: formattedDate }}
      />
    </Alert>
  );
}
