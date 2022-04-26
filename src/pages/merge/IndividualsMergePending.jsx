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
const baoOptions = {
  spills: { component: BaoSpills, width: 410 },
  letter: { component: BaoLetter, width: 380 },
};

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

export default function IndividualsMergePending() {
  useDocumentTitle('INDIVIDUALS_MERGE_PENDING_TITLE');
  const { guid: mergeRequestGuid } = useParams();
  const intl = useIntl();
  const theme = useTheme();
  const themeColor = theme.palette.primary.main;

  const {
    data: mergeRequestData,
    loading: mergeRequestLoading,
    error: mergeRequestError,
  } = useIndividualMergeRequest(mergeRequestGuid);

  const deadline = mergeRequestData?.eta;
  const formattedDeadline = deadline
    ? formatDateCustom(deadline, 'LLLL do')
    : intl.formatMessage({ id: 'DATE_MISSING' });

  const {
    component: BaoComponent,
    width: baoWidth,
  } = mergeRequestError ? baoOptions.spills : baoOptions.letter;

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
      <BaoComponent
        themeColor={themeColor}
        style={{ width: baoWidth, margin: '48px 8px 20px 0' }}
      />
      {mergeRequestLoading && <MergeRequestLoadingParagraph />}
      {mergeRequestError && (
        <CustomAlert severity="error">
          {mergeRequestError}
        </CustomAlert>
      )}
      {mergeRequestData && (
        <Text
          variant="subtitle2"
          style={{ padding: '0 16px 8px 16px', maxWidth: 400 }}
          id="INDIVIDUALS_MERGE_PENDING_DESCRIPTION"
          values={{ deadlineDate: formattedDeadline }}
        />
      )}
      {!mergeRequestError && (
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
      )}
    </MainColumn>
  );
}
