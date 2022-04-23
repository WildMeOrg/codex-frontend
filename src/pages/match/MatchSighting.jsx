import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from 'lodash-es';

import useSighting from '../../models/sighting/useSighting';
import useMatchResults from '../../models/matching/useMatchResults';
import MainColumn from '../../components/MainColumn';
import Text from '../../components/Text';
import QueryAnnotationsTable from './QueryAnnotationsTable';
import ImageCard from './ImageCard';

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

  const [
    selectedQueryAnnotation,
    setSelectedQueryAnnotation,
  ] = useState(null);

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

  console.log(sightingData);
  console.log(matchResults);
  console.log(selectedQueryAnnotation);
  console.log(queryAnnotations);

  return (
    <MainColumn fullWidth>
      <Text variant="h4">Review match candidates</Text>
      <div style={{ display: 'flex' }}>
        <div style={{ maxWidth: '40vw' }}>
          <ImageCard
            titleId="FILENAME"
            annotation={selectedQueryAnnotation}
          />
          <QueryAnnotationsTable
            queryAnnotations={queryAnnotations}
            selectedQueryAnnotation={selectedQueryAnnotation}
            setSelectedQueryAnnotation={setSelectedQueryAnnotation}
          />
        </div>
        <div style={{ maxWidth: '40vw' }}>
          <ImageCard
            titleId="FILENAME"
            annotation={selectedQueryAnnotation}
          />
        </div>
      </div>
    </MainColumn>
  );
}
