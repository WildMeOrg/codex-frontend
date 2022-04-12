import React from 'react';
import { useParams } from 'react-router';
import { useIntl } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import useIndividualMergeRequest from '../../models/individual/useIndividualMergeRequest';
import BaoLetter from '../../components/svg/BaoLetter';
import BaoSpills from '../../components/svg/BaoSpills';
import ButtonLink from '../../components/ButtonLink';
import CustomAlert from '../../components/Alert';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import { formatDateCustom } from '../../utils/formatters';

/**
 * Because the Bao SVGs have different dimensions, these widths were selected
 * to keep the Bao characters approximately the same size on the page.
 */
const baoSpillsWidth = 410;
const baoLetterWidth = 380;

function Bao({ isError }) {
  const theme = useTheme();
  const themeColor = theme.palette.primary.main;

  return isError ? (
    <BaoSpills
      themeColor={themeColor}
      style={{ width: baoSpillsWidth, margin: '48px 8px 20px 0' }}
    />
  ) : (
    <BaoLetter
      themeColor={themeColor}
      style={{ width: baoLetterWidth, margin: '48px 8px 20px 0' }}
    />
  );
}

function MergeRequestLoadingParagraph() {
  return (
    <Typography
      variant="subtitle2"
      style={{ padding: '0 16px 8px 16px', maxWidth: 400 }}
    >
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton width="60%" />
    </Typography>
  );
}

function MergeRequestContent({ loading, data }) {
  const intl = useIntl();

  const deadline = data?.eta;
  const formattedDeadline = deadline
    ? formatDateCustom(deadline, 'LLLL do')
    : intl.formatMessage({ id: 'DATE_MISSING' });

  return (
    <>
      {loading ? (
        <MergeRequestLoadingParagraph />
      ) : (
        <Text
          variant="subtitle2"
          style={{ padding: '0 16px 8px 16px', maxWidth: 400 }}
          id="INDIVIDUALS_MERGE_PENDING_DESCRIPTION"
          values={{ deadlineDate: formattedDeadline }}
        />
      )}
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
      </Grid>
    </>
  );
}

export default function IndividualsMergePending() {
  useDocumentTitle('INDIVIDUALS_MERGE_PENDING_TITLE');
  const { guid: mergeRequestGuid } = useParams();

  const {
    data: mergeRequestData,
    loading: mergeRequestLoading,
    error: mergeRequestError,
  } = useIndividualMergeRequest(mergeRequestGuid);

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
        id="INDIVIDUALS_MERGE_PENDING_TITLE"
      />
      <Bao isError={Boolean(mergeRequestError)} />
      {mergeRequestError ? (
        <CustomAlert severity="error">
          {mergeRequestError}
        </CustomAlert>
      ) : (
        <MergeRequestContent
          loading={mergeRequestLoading}
          data={mergeRequestData}
        />
      )}
    </MainColumn>
  );
}
