import React from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';
import BaoHappy from '../../components/svg/BaoHappy';

export default function BulkImportSuccess() {
  const theme = useTheme();
  const themeColor = theme.palette.primary.main;
  const { id } = useParams();
  useDocumentTitle('REPORT_SUCCESS_TITLE');

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
        style={{ padding: '32px 0 8px 16px' }}
        id="BULK_SUCCESS_TITLE"
      />
      <BaoHappy
        style={{ width: 280, margin: '16px 8px 20px 0' }}
        themeColor={themeColor}
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
            href={`/bulk-imports/${id}`}
            id="VIEW_BULK_IMPORT"
          />
        </Grid>
      </Grid>
    </MainColumn>
  );
}
