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
      console.log('operations in patch', operations);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/individuals/${individualId}`,
        withCredentials: true,
        method: 'patch',
        data: operations,
      });

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
    // names must be handled separately because (1) multiple request with the path /names could be
    // required, and (2) a name may need to be added or replaced.
    console.log('dictionary',dictionary);
    const customFields = dictionary['customFields'];
    const newCustomFields = {}
    for(const key in customFields) {
      const value = customFields[key];
      if(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        console.log('=============');
        const utcTimestamp = value;
        const date = new Date(utcTimestamp);
        const timezoneOffset = date.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
        const offsetMinutes = Math.abs(timezoneOffset) % 60;
        const offsetSign = timezoneOffset < 0 ? "+" : "-";
        const offsetFormatted = `${offsetSign}${String(offsetHours).padStart(2, "0")}:${String(offsetMinutes).padStart(2, "0")}`;
        const adjustedTimestampWithoutZ = new Date(date.getTime() - timezoneOffset * 60 * 1000).toISOString().slice(0, -1);

        const adjustedTimestampWithOffset = `${adjustedTimestampWithoutZ}${offsetFormatted}`;

console.log(adjustedTimestampWithOffset);


        newCustomFields[key] = adjustedTimestampWithOffset;
      }else {
        console.log('>>>>>>>>>>>>>');
        newCustomFields[key] = value;
      }
    }
    dictionary['customFields'] = newCustomFields;
    console.log('newCustomFields', newCustomFields);
    console.log('new dictionary', dictionary);
    const { names = [], ...dictionaryWithoutNames } = dictionary;
    const date = new Date();
    console.log('date', date);
    console.log('date to UTC', date.toLocaleString());

    let operations = Object.keys(dictionaryWithoutNames).map(
      propertyKey => ({
        op: 'replace',
        path: `/${propertyKey}`,
        value: dictionaryWithoutNames[propertyKey],
      }),
    );

    if (names.length > 0) {
      const nameOperations = names.map(({ op, ...value }) => ({
        op,
        path: '/names',
        value,
      }));
      operations = [...operations, ...nameOperations];
    }

    console.log('operations',operations);

    return patchIndividual(individualId, operations);
  };

  const removeEncounterFromIndividual = async (
    individualId,
    encounterId,
  ) => {
    const operations = [
      { op: 'remove', path: '/encounters', value: encounterId },
    ];
    return patchIndividual(individualId, operations);
  };

  return {
    updateIndividualProperties,
    removeEncounterFromIndividual,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
