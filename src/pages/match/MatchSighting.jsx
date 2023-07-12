import React, { useMemo, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { get, maxBy } from 'lodash-es';

import Chip from '@material-ui/core/Chip';
import Fab from '@material-ui/core/Fab';
import DoneIcon from '@material-ui/icons/Done';

import errorTypes from '../../constants/errorTypes';
import useSighting from '../../models/sighting/useSighting';
import useMatchResults from '../../models/matching/useMatchResults';
import { formatDate } from '../../utils/formatters';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ReviewSightingDialog from '../../components/dialogs/ReviewSightingDialog';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import ButtonMenu from '../../components/ButtonMenu';
import Text from '../../components/Text';
import QueryAnnotationsTable from './QueryAnnotationsTable';
import MatchCandidatesTable from './MatchCandidatesTable';
import ImageCard from './ImageCard';
import { FormControlLabel } from '@material-ui/core';
import { Switch } from '@material-ui/core';

const spaceBetweenColumns = 16;

function deriveIndividualGuid(annotation) {
  /* Sometimes houston returns non-guid "guids" for this property */
  const providedGuid = annotation?.individual_guid;
  return providedGuid === 'None' ? null : providedGuid;
}

export default function MatchSighting() {
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

  const [selectedQueryAnnotation, setSelectedQueryAnnotation] =
    useState(null);

  const [selectedMatchCandidate, setSelectedMatchCandidate] =
    useState(null);

  const [ checked, setChecked ] = useState(false);

  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const [ heatMapUrl, setHeatMapUrl ] = useState(null);
  const [ urlOK, setUrlOK ] = useState(false);

  const queryAnnotations = useMemo(() => {
    const annotationData = get(matchResults, 'annotation_data', {});
    const originalQueryAnnotations = get(
      matchResults,
      'query_annotations',
      [],
    );
    return originalQueryAnnotations.map((annotSageData, index) => {
      const hotspotterAnnotationScores = get(
        annotSageData,
        ['algorithms', 'hotspotter_nosv', 'scores_by_annotation'],
        [],
      );
      const topScoreAnnotation = maxBy(
        hotspotterAnnotationScores,
        'score',
      );
      const annotHoustonData = get(
        annotationData,
        annotSageData?.guid,
        {},
      );
      return {
        ...annotHoustonData,
        ...annotSageData,
        topScore: topScoreAnnotation?.score,
        index,
      };
    });
  }, [matchResults]);

  const matchCandidates = useMemo(() => {
    const hotspotterAnnotationScores = get(
      selectedQueryAnnotation,
      ['algorithms', 'hotspotter_nosv', 'scores_by_individual'],
      [],
    );

    function findMatchingAnnotation(scoreObject) {
      return get(matchResults, [
        'annotation_data',
        scoreObject?.guid,
      ]);
    }

    return hotspotterAnnotationScores
      .filter(findMatchingAnnotation)
      .map((scoreObject, index) => {
        const matchingAnnotation =
          findMatchingAnnotation(scoreObject);
        return {
          ...matchingAnnotation,
          ...scoreObject,
          index,
        };
      });
  }, [matchResults, selectedQueryAnnotation]);

  const confirmMatchHref = useMemo(() => {
    const individualGuid1 = deriveIndividualGuid(
      selectedQueryAnnotation,
    );
    const individualGuid2 = deriveIndividualGuid(
      selectedMatchCandidate,
    );
    const encounterGuid1 = selectedQueryAnnotation?.encounter_guid;
    const encounterGuid2 = selectedMatchCandidate?.encounter_guid;

    const selectedMatchCandidateGuid = selectedMatchCandidate?.guid;  
    const scoresByIndividual = get(selectedQueryAnnotation,
      ['algorithms', 'hotspotter_nosv', 'scores_by_individual'], [] );
    const annotation = scoresByIndividual.find((score) => score.guid === selectedMatchCandidateGuid);    
    const heatmapUrl = annotation?.heatmap_src;
    console.log(heatmapUrl);
    setHeatMapUrl(heatmapUrl);
    const checkHeatMap = async () => {
      try {
        const response = await fetch(heatMapUrl);
        if (response.ok) {
          setUrlOK(true);
          } else {
            setUrlOK(false);
        }
      } catch (error) {
        setUrlOK(false);
      }
    }
    checkHeatMap();
  
    if (individualGuid1 && individualGuid2) {
      return `/merge?i=${individualGuid1}&i=${individualGuid2}`;
    } else if (individualGuid1 || individualGuid2) {
      const individualGuid = individualGuid1 || individualGuid2;
      const encounterGuid = individualGuid1
        ? encounterGuid2
        : encounterGuid1;
      return `/assign-annotations?i=${individualGuid}&e=${encounterGuid}`;
    } else {
      return `/create-individual?e=${encounterGuid1}&e=${encounterGuid2}`;
    }
  }, [selectedQueryAnnotation, selectedMatchCandidate]);

  useEffect(() => {
    if (!selectedQueryAnnotation)
      setSelectedQueryAnnotation(queryAnnotations?.[0]);
    if (matchCandidates)
      setSelectedMatchCandidate(matchCandidates?.[0]);
  }, [
    queryAnnotations,
    selectedQueryAnnotation,
    selectedQueryAnnotation?.guid,
    matchCandidates,
  ]);

  useDocumentTitle(`Match results for sighting ${sightingGuid}`, {
    translateMessage: false,
  });

  const loading = sightingDataLoading || matchResultsLoading;
  const error = sightingDataError || matchResultsError;

  if (error) return <SadScreen variant={errorTypes.genericError} />;
  if (loading) return <LoadingScreen />;

  const buttonActions = [
    {
      id: 'mark-sighting-reviewed',
      labelId: 'MARK_SIGHTING_REVIEWED',
      onClick: () => setReviewDialogOpen(true),
    },
  ];

  const idCompleteTime = sightingData?.unreviewed_start_time;
  const formattedIdTime = formatDate(
    idCompleteTime,
    true,
    'Unknown time',
  );

  const sightingIsReviewed = Boolean(sightingData?.review_time);
  const matchPossible =
    selectedMatchCandidate && selectedQueryAnnotation;
 
  const handleChange = () => {
    setChecked(!checked);    
  }

  return (
    <MainColumn
      fullWidth
      style={{ maxWidth: 'unset', padding: '0 16px' }}
    >
      <ReviewSightingDialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        sightingGuid={sightingGuid}
      />
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
          <Text variant="h4" id="REVIEW_MATCH_CANDIDATES" />
          <Text
            variant="subtitle2"
            id="IDENTIFICATION_FINISHED_TIME"
            values={{ time: formattedIdTime }}
            style={{ padding: '2px 0 0 2px' }}
          />
          {sightingIsReviewed && (
            <Chip
              icon={<DoneIcon />}
              variant="outlined"
              label="Reviewed"
              style={{ marginTop: 8 }}
            />
          )}
        </div>
        <div style={{display: "flex", flexDirection: 'row'}}>
        <FormControlLabel 
          control={<Switch 
                      checked={checked} 
                      onChange = {() => handleChange()}
                      disabled={!urlOK || !heatMapUrl}
          />} 
          label="Inspect match area" />
        <ButtonMenu
          buttonId="match-actions"
          style={{ marginTop: 44 }}
          actions={buttonActions}
          id="ACTIONS"
        />
        </div>
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
            heatmapon={checked}
            heatmapurl={heatMapUrl}
            left={true}
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
            heatmapon={checked}
            heatmapurl={heatMapUrl}
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
          style={{
            position: 'fixed',
            bottom: 16,
            right: 40,
            zIndex: 1,
          }}
          color="primary"
          variant="extended"
          href={confirmMatchHref}
        >
          <DoneIcon style={{ marginRight: 4 }} />
          <FormattedMessage id="CONFIRM_MATCH" />
        </Fab>
      )}
    </MainColumn>
  );
}
