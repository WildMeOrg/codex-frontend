import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useDeleteSighting() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [vulnerableIndividual, setVulnerableIndividual] = useState(
    null,
  );

  const deleteSighting = async (
    sightingId,
    forceDeleteIndividual = false,
  ) => {
    try {
      setLoading(true);
      const deleteResponse = await axios({
        url: `${__houston_url__}/api/v1/sightings/${sightingId}`,
        withCredentials: true,
        method: 'delete',
        headers: {
          'x-allow-delete-cascade-individual': forceDeleteIndividual
            ? 'True'
            : 'False',
        },
      });
      const responseStatus = get(deleteResponse, 'status');
      const successful = responseStatus === 204;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        setVulnerableIndividual(null);
        return true;
      }

      setError(formatError(deleteResponse));
      setSuccess(false);
      return false;
    } catch (postError) {
      setLoading(false);
      const vulnerableIndividualGuid =
        postError?.response?.data?.vulnerableIndividualGuid;
      setVulnerableIndividual(vulnerableIndividualGuid);
      setError(formatError(postError));
      setSuccess(false);
      return false;
    }
  };

  return {
    deleteSighting,
    loading,
    error,
    setError,
    onClearError: () => setError(null),
    success,
    setSuccess,
    vulnerableIndividual,
    onClearVulnerableIndividual: () => setVulnerableIndividual(null),
  };
}
