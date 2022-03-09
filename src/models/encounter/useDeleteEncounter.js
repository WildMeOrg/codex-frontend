import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useDeleteEncounter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vulnerableObject, setVulnerableObject] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteEncounter = async (
    encounterId,
    forceDeleteSighting = false,
    forceDeleteIndividual = false,
  ) => {
    try {
      console.log('deleteMe got here a0');
      console.log(
        'deleteMe forceDeleteSighting is: ' + forceDeleteSighting,
      );
      console.log(
        'deleteMe forceDeleteIndividual is: ' + forceDeleteIndividual,
      );
      setLoading(true);
      console.log('deleteMe got here a0.5');
      const deleteResponse = await axios({
        url: `${__houston_url__}/api/v1/encounters/${encounterId}`,
        withCredentials: true,
        method: 'delete',
        headers: {
          'x-allow-delete-cascade-sighting': forceDeleteSighting
            ? 'True'
            : 'False',
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
        return true;
      }
      console.log('deleteMe deleteResponse at this point is:');
      console.log(deleteResponse);
      // debugger;

      setError(formatError(deleteResponse));
      setSuccess(false);
      return false;
    } catch (postError) {
      const vulnerableIndividualGuid =
        postError?.response?.data?.vulnerableIndividualGuid;
      const vulnerableSightingGuid =
        postError?.response?.data?.vulnerableSightingGuid;
      const vulnerableOject = vulnerableSightingGuid
        ? { vulnerableSightingGuid }
        : { vulnerableIndividualGuid };
      setVulnerableObject(vulnerableOject);
      setLoading(false);
      if (vulnerableIndividualGuid || vulnerableSightingGuid) {
        console.log('deleteMe got here h0');
        setError(null);
      } else {
        setError(formatError(postError));
      }
      setSuccess(false);
      return false;
    }
  };

  return {
    deleteEncounter,
    loading,
    error,
    onClearError: () => setError(null),
    setError,
    success,
    setSuccess,
    vulnerableObject,
    setVulnerableObject,
  };
}
