import { useEffect, useState } from 'react';
import { get, zipWith, sortBy } from 'lodash-es';
import axios from 'axios';

export default function useIaLogs(taskId, acmId) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const response = await axios(
            `https://www.flukebook.org/iaLogs.jsp?taskId=${taskId}`,
          );
          const responseData = get(response, 'data', []);
          const jobResultData = responseData.find(
            datum =>
              get(datum, ['status', '_action']) === 'getJobResult',
          );
          const cmDict = get(jobResultData, [
            'status',
            '_response',
            'response',
            'json_result',
            'cm_dict',
          ]);
          const taskCmDict = get(cmDict, acmId);
          const ids = get(taskCmDict, 'dannot_uuid_list', []);
          const scores = get(taskCmDict, 'score_list', []);

          const candidates = zipWith(
            ids,
            scores,
            (idObject, score) => ({ id: idObject.__UUID__, score }),
          );
          const filteredCandidates = candidates.filter(
            candidate => candidate.score > 0.7,
          );

          const candidateData = await Promise.all(
            filteredCandidates.map(candidate => {
              const candidateAcmId = get(candidate, 'id');
              return axios(
                `https://www.flukebook.org/iaResults.jsp?acmId=${candidateAcmId}`,
              );
            }),
          );

          const candidatesWithData = zipWith(
            filteredCandidates,
            candidateData,
            (candidate, candidateFetchResponse) => {
              const annotation = get(candidateFetchResponse, [
                'data',
                'annotations',
                '0',
              ]);
              return { ...candidate, annotation };
            },
          );

          const filteredSortedCandidates = sortBy(
            candidatesWithData,
            candidate => -candidate.score,
          );

          setData(filteredSortedCandidates);
          setLoading(false);
          setError(false);
        } catch (fetchError) {
          setError(fetchError);
          setLoading(false);
          console.error('Error fetching site settings');
          console.error(fetchError);
        }
      };

      if (acmId) fetchData();
    },
    [acmId],
  );

  return { data, loading, error, setError, setLoading };
}
