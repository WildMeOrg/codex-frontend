import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';
import { formatUTCTimeToLocalTimeWithTimezone } from '../../utils/formatters';

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

  //this is a function that takes in an individualId and a dictionary of properties to update

  const updateIndividualProperties = async (
    individualId,
    dictionary,
  ) => {    
    const regex = /"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/;
    const customFields = dictionary['customFields'];
    const newCustomFields = {};
    for(const key in customFields) {
      const value = customFields[key];
      if(Array.isArray(customFields[key])) {
        const newValue = [];
        for(const item of value) {
          if( item && regex.test(JSON.stringify(item))) {
            const adjustedTimestampWithOffset = formatUTCTimeToLocalTimeWithTimezone(item);
            newValue.push(adjustedTimestampWithOffset);
          }else {
            newValue.push(item);
          }
        }
        newCustomFields[key] = newValue;
      } else {
        if( value && regex.test(JSON.stringify(value))) {
          const adjustedTimestampWithOffset = formatUTCTimeToLocalTimeWithTimezone(value);
          newCustomFields[key] = adjustedTimestampWithOffset;
        }else {
          newCustomFields[key] = value;
        }
      } 
    }
    dictionary['customFields'] = newCustomFields;
    const { names = [], ...dictionaryWithoutNames } = dictionary;

    let operations = Object.keys(dictionaryWithoutNames).map(
      propertyKey => ({
        op: 'replace',
        path: `/${propertyKey}`,
        value: dictionaryWithoutNames[propertyKey],
      }),
    );
    
    // names must be handled separately because (1) multiple request with the path /names could be
    // required, and (2) a name may need to be added or replaced.    
    if (names.length > 0) {
      const nameOperations = names.map(({ op, ...value }) => ({
        op,
        path: '/names',
        value,
      }));
      operations = [...operations, ...nameOperations];
    }
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
