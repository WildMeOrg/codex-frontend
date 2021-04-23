import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useRemoveCustomField() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const removeCustomField = async (
    settingSpecifier,
    fieldId,
    force = false,
  ) => {
    const operation = {
      force,
      op: 'remove',
      path: `${settingSpecifier}/${fieldId}`,
    };

    try {
      setLoading(true);
      const patchResponse = await axios({
        url: `${__houston_url__}/api/v1/configuration/default`,
        withCredentials: true,
        method: 'patch',
        data: [operation],
      });
      const responseStatus = get(patchResponse, 'status');
      const successful = responseStatus === 200;
      if (successful) {
        setLoading(false);
        setSuccess(true);
        setError(null);
        return true;
      }

      setError(formatError(patchResponse));
      setSuccess(false);
      return false;
    } catch (patchError) {
      console.log(patchError);
      setLoading(false);
      setError(formatError(patchError));
      setSuccess(false);
      return false;
    }
  };

  return {
    removeCustomField,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
