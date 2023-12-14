import React, { useMemo, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import _, { get, maxBy } from 'lodash-es';

import Fab from '@material-ui/core/Fab';
import DoneIcon from '@material-ui/icons/Done';

import { Switch } from '@material-ui/core';
import errorTypes from '../../constants/errorTypes';
import useSighting from '../../models/sighting/useSighting';
import useMatchResults from '../../models/matching/useMatchResults';
import { formatDate } from '../../utils/formatters';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import ReviewSighting from '../../components/dialogs/ReviewSighting';
import LoadingScreen from '../../components/LoadingScreen';
import SadScreen from '../../components/SadScreen';
import MainColumn from '../../components/MainColumn';
import ButtonLink from '../../components/ButtonLink';
import Text from '../../components/Text';
import QueryAnnotationsTable from './QueryAnnotationsTable';
import MatchCandidatesTable from './MatchCandidatesTable';
import ImageCard from './ImageCard';
import Button from '../../components/Button';
import useIndividual from '../../models/individual/useIndividual';
import useEncounter from '../../models/encounter/useEncounter';

const spaceBetweenColumns = 16;

function deriveIndividualGuid(annotation) {
  /* Sometimes houston returns non-guid "guids" for this property */
  const providedGuid = annotation?.individual_guid;
  return providedGuid === 'None' ? null : providedGuid;
}

export default function MatchSighting() {
  const { sightingGuid } = useParams();
  const intl = useIntl();
  const label = intl.formatMessage({ id: 'INSPECT_MATCH_AREA' });
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

  const [checked, setChecked] = useState(false);

  const [heatMapUrl, setHeatMapUrl] = useState(null);
  const [urlOK, setUrlOK] = useState(false);

  const [noMatch, setNoMatch] = useState(false);
  const [individual, setIndividual] = useState(null);

  const [matchStatus, setMatchStatus] = useState(null);
  useEffect(() => {
    setMatchStatus(sightingData?.match_state);
  }, [sightingData]);

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

  const queryIndividualId = selectedQueryAnnotation?.individual_guid;
  const queryEncounterId = selectedQueryAnnotation?.encounter_guid;
  const matchIndividuaId = selectedMatchCandidate?.individual_guid;
  const matchEncounterId = selectedMatchCandidate?.encounter_guid;

  const { data: individualData_query } =
    useIndividual(queryIndividualId);
  const { data: individualData_match } =
    useIndividual(matchIndividuaId);
  const { data: encounterData_query } =
    useEncounter(queryEncounterId);
  const { data: encounterData_match } =
    useEncounter(matchEncounterId);

  function getAllAnnotationsFromIndividual(individualData) {
    const encounters = [];
    individualData?.encounters.map(data => {
      encounters.push(data);
      return null;
    });
    const annotations = [];
    encounters.map(data => {
      annotations.push(...data.annotations);
      return null;
    });
    return annotations;
  }

  function getAllAnnotationsFromEncounter(encounterData) {
    const annotations = encounterData?.annotations;
    return annotations;
  }

  const getAndDeduplicateAnnotations = (
    individualData,
    encounterData,
  ) => {
    const annotationsFromIndividual =
      getAllAnnotationsFromIndividual(individualData) || [];
    const annotationsFromEncounter =
      getAllAnnotationsFromEncounter(encounterData) || [];

    return (
      _.uniqWith(
        [...annotationsFromIndividual, ...annotationsFromEncounter],
        _.isEqual,
      ) || []
    );
  };

  const queryAllData = getAndDeduplicateAnnotations(
    individualData_query,
    encounterData_query,
  );
  const matchAllData = getAndDeduplicateAnnotations(
    individualData_match,
    encounterData_match,
  );

  const matchCandidates = useMemo(() => {
    const hotspotterAnnotationScores = get(
      selectedQueryAnnotation,
      ['algorithms', 'hotspotter_nosv', 'scores_by_individual'],
      [],
    );

    setIndividual(deriveIndividualGuid(selectedQueryAnnotation));

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
    const scoresByIndividual = get(
      selectedQueryAnnotation,
      ['algorithms', 'hotspotter_nosv', 'scores_by_individual'],
      [],
    );
    const annotation = scoresByIndividual.find(
      score => score.guid === selectedMatchCandidateGuid,
    );
    const heatmapUrl = annotation?.heatmap_src;
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
    };
    checkHeatMap();

    if (!noMatch) {
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
    } else if (!individualGuid1) {
      return `/create-individual?e=${encounterGuid1}`;
    } else {
      return null;
    }
  }, [selectedQueryAnnotation, selectedMatchCandidate, noMatch]);

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

  const idCompleteTime = sightingData?.unreviewed_start_time;
  const formattedIdTime = formatDate(
    idCompleteTime,
    true,
    'Unknown time',
  );

  const matchPossible =
    selectedMatchCandidate && selectedQueryAnnotation;

  const handleChange = () => {
    setChecked(!checked);
  };

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
          <Text variant="h4" id="REVIEW_MATCH_CANDIDATES" />
          <Text
            variant="subtitle2"
            id="IDENTIFICATION_FINISHED_TIME"
            values={{ time: formattedIdTime }}
            style={{ padding: '2px 0 0 2px' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <Switch
            checked={checked}
            onChange={() => handleChange()}
            disabled={!urlOK || !heatMapUrl}
          />
          <span style={{ marginBottom: 10, marginRight: 10 }}>
            {' '}
            {label}{' '}
          </span>
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
            left
            allData={queryAllData}
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
            allData={matchAllData}
          />
          <MatchCandidatesTable
            matchCandidates={matchCandidates}
            selectedMatchCandidate={selectedMatchCandidate}
            setSelectedMatchCandidate={setSelectedMatchCandidate}
          />
          {!individual && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Text
                variant="body2"
                id="NO_MATCH_DESCRIPTION"
                style={{ padding: '16px 20px 8px 20px' }}
              />
              <Button
                display="tertiary"
                onClick={() => setNoMatch(true)}
                id="CONFIRM_NO_MATCH"
                href={confirmMatchHref}
              />
            </div>
          )}
        </div>
      </div>
      {matchPossible && (
        <Fab
          style={{
            position: 'fixed',
            bottom: 16,
            right: 40,
            zIndex: 10,
            borderRadius: 4,
          }}
          color="primary"
          variant="extended"
          href={confirmMatchHref}
          onClick={() => setNoMatch(false)}
        >
          <DoneIcon style={{ marginRight: 4 }} />
          <FormattedMessage id="CONFIRM_MATCH" />
        </Fab>
      )}
      <ReviewSighting
        matchStatus={matchStatus}
        sightingGuid={sightingGuid}
      />
    </MainColumn>
  );
}
