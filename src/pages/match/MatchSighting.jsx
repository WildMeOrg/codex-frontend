import React, { useMemo, useState } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { get } from 'lodash-es';

import Fab from '@material-ui/core/Fab';
import MatchIcon from '@material-ui/icons/Done';

import { formatDate } from '../../utils/formatters';
import useSighting from '../../models/sighting/useSighting';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useMatchResults from '../../models/matching/useMatchResults';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import ButtonMenu from '../../components/ButtonMenu';
import Text from '../../components/Text';
import QueryAnnotationsTable from './QueryAnnotationsTable';
import MatchCandidatesTable from './MatchCandidatesTable';
import ImageCard from './ImageCard';

const spaceBetweenColumns = 16;

const buttonActions = [
  {
    id: 'create-new-individual',
    labelId: 'CREATE_NEW_INDIVIDUAL',
  },
  {
    id: 'mark-unidentifiable',
    labelId: 'MARK_UNIDENTIFIABLE',
  },
];

export default function MatchSighting() {
  const intl = useIntl();
  const { sightingGuid } = useParams();

  const {
    data: sightingData,
    loading: sightingDataLoading,
    error: sightingDataError,
  } = useSighting(sightingGuid);

  const {
    data: matchResults,
    loading: matchResultsLoading,
    error: matchResultsError,
  } = useMatchResults(sightingGuid);

  const [
    selectedQueryAnnotation,
    setSelectedQueryAnnotation,
  ] = useState(null);

  const [
    selectedMatchCandidate,
    setSelectedMatchCandidate,
  ] = useState(null);

  useDocumentTitle(`Match results for sighting ${sightingGuid}`, {
    translateMessage: false,
  });

  const queryAnnotations = useMemo(
    () => {
      const annotationData = get(matchResults, 'annotation_data', {});
      const originalQueryAnnotations = get(
        matchResults,
        'query_annotations',
        [],
      );
      return originalQueryAnnotations.map(annotSageData => {
        const annotHoustonData = get(
          annotationData,
          annotSageData?.guid,
          {},
        );
        return {
          ...annotHoustonData,
          ...annotSageData,
        };
      });
    },
    [matchResults],
  );

  const matchCandidates = useMemo(
    () => {
      const hotspotterAnnotationScores = get(
        selectedQueryAnnotation,
        ['algorithms', 'hotspotter_nosv', 'scores_by_annotation'],
        [],
      );
      return hotspotterAnnotationScores.map(scoreObject => {
        const matchingAnnotation = get(matchResults, [
          'annotation_data',
          scoreObject?.guid,
        ]);
        return {
          ...matchingAnnotation,
          ...scoreObject,
        };
      });
    },
    [matchResults, selectedQueryAnnotation],
  );

  const loading = sightingDataLoading || matchResultsLoading;
  const error = sightingDataError || matchResultsError;

  if (loading) return <LoadingScreen />;
  if (error) return <SadScreen variant="genericError" />;

  const idCompleteTime = sightingData?.unreviewed_start_time;
  const formattedIdTime = formatDate(
    idCompleteTime,
    true,
    'Unknown time',
  );

  const matchPossible =
    selectedMatchCandidate && selectedQueryAnnotation;

  return (
    <MainColumn
      fullWidth
      style={{ maxWidth: 'unset', padding: '0 16px' }}
    >
      <div
        style={{
          padding: '16px 0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <ButtonLink
            href={`/sightings/${sightingGuid}`}
            display="back"
            id="BACK_TO_SIGHTING"
          />
          <Text variant="h4">Review match candidates</Text>
          <Text
            variant="subtitle2"
            id="IDENTIFICATION_FINISHED_TIME"
            values={{ time: formattedIdTime }}
            style={{ padding: '2px 0 0 2px' }}
          />
        </div>
        <ButtonMenu
          buttonId="match-actions"
          style={{ marginTop: 44 }}
          actions={buttonActions}
        >
          Actions
        </ButtonMenu>
      </div>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            width: '50%',
            paddingRight: 0.5 * spaceBetweenColumns,
          }}
        >
          <ImageCard
            titleId="SELECTED_QUERY_ANNOTATION"
            annotation={selectedQueryAnnotation}
          />
          <QueryAnnotationsTable
            queryAnnotations={queryAnnotations}
            selectedQueryAnnotation={selectedQueryAnnotation}
            setSelectedQueryAnnotation={setSelectedQueryAnnotation}
          />
        </div>
        <div
          style={{
            width: '50%',
            paddingLeft: 0.5 * spaceBetweenColumns,
          }}
        >
          <ImageCard
            titleId="SELECTED_MATCH_CANDIDATE"
            annotation={selectedMatchCandidate}
          />
          <MatchCandidatesTable
            matchCandidates={matchCandidates}
            selectedMatchCandidate={selectedMatchCandidate}
            setSelectedMatchCandidate={setSelectedMatchCandidate}
          />
        </div>
      </div>
      {matchPossible && (
        <Fab
          style={{ position: 'fixed', bottom: 16, right: 16 }}
          color="primary"
          variant="extended"
        >
          <MatchIcon style={{ marginRight: 4 }} />
          <FormattedMessage id="CONFIRM_MATCH" />
        </Fab>
      )}
    </MainColumn>
  );
}
