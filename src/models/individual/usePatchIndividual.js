import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function usePatchIndividual() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const patchIndividual = async (individualId, operations) => {
    try {
      setLoading(true);
      setError(null);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/individuals/${individualId}`,
        withCredentials: true,
        method: 'patch',
        data: operations,
      });
      console.log(patchResponse);

      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        return true;
      }

      const backendErrorMessage = get(patchResponse, 'message');
      const errorMessage =
        backendErrorMessage || formatError(patchResponse);
      setError(errorMessage);
      setSuccess(false);
      return false;
    } catch (postError) {
      const backendErrorMessage = get(postError, [
        'response',
        'data',
        'message',
      ]);
      const errorMessage =
        backendErrorMessage || formatError(postError);
      setLoading(false);
      setError(errorMessage);
      setSuccess(false);
      return false;
    }
  };

  const updateIndividualProperties = async (
    individualId,
    dictionary,
  ) => {
    const operations = Object.keys(dictionary).map(propertyKey => ({
      op: 'replace',
      path: `/${propertyKey}`,
      value: dictionary[propertyKey],
    }));
    return patchIndividual(individualId, operations);
  };

  const addEncounterToIndividual = async (
    individualId,
    encounterId,
  ) => {
    const operations = [
      {
        op: 'add',
        path: '/encounters',
        value: encounterId,
      },
    ];
    return patchIndividual(individualId, operations);
  };

  const removeEncounterFromIndividual = async (
    individualId,
    encounterId,
  ) => {
    const operations = [
      {
        op: 'remove',
        path: '/encounters',
        value: encounterId,
      },
    ];
    return patchIndividual(individualId, operations);
  };

  return {
    addEncounterToIndividual,
    updateIndividualProperties,
    removeEncounterFromIndividual,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
