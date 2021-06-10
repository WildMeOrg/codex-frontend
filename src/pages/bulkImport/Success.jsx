import React from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';

export default function BulkImportSuccess() {
  const { id } = useParams();
  const intl = useIntl();
  useDocumentTitle(
    intl.formatMessage({ id: 'REPORT_SUCCESS_TITLE' }),
  );

  return (
    <MainColumn
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 500,
      }}
    >
      <Text
        variant="h4"
        component="h4"
        style={{ padding: '16px 0 8px 16px' }}
        id="BULK_SUCCESS_TITLE"
      />
      <Text
        variant="subtitle2"
        style={{ padding: '0 16px 8px 16px', maxWidth: 400 }}
        id="BULK_SUCCESS_DESCRIPTION"
      />
      <Grid
        container
        spacing={2}
        direction="column"
        style={{ padding: 16, maxWidth: 340 }}
      >
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{ width: '100%' }}
            display="primary"
            href="/"
            id="RETURN_HOME"
          />
        </Grid>
        <Grid item style={{ position: 'relative' }}>
          <ButtonLink
            style={{
              width: '100%',
            }}
            display="secondary"
            href={`/assetgroups/${id}`}
            id="VIEW_BULK_IMPORT"
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
