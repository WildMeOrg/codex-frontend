import { useState, useContext } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { AppContext, setSiteSettingsNeedsFetch } from '../../context';
import { formatError } from '../../utils/formatters';

export default function useRemoveCustomField() {
  const { dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [needsForce, setNeedsForce] = useState(false);

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
      setNeedsForce(false);

      if (successful) {
        dispatch(setSiteSettingsNeedsFetch(true));
        setLoading(false);
        setSuccess(true);
        setError(null);
        return true;
      }

      setError(formatError(patchResponse));
      setSuccess(false);
      return false;
    } catch (patchError) {
      const errorCode = get(patchError, ['response', 'status']);
      if (errorCode === 602) {
        const recordCount = get(patchError, [
          'response',
          'data',
          'numValues',
        ]);
        setNeedsForce(true);
        setError(
          `This field has been used to store data. If you delete the field, all data that was stored in the field will be deleted. Are you sure you want to delete ${recordCount} record(s)?`,
        );
      } else {
        setNeedsForce(false);
        setError(formatError(patchError));
      }

      setLoading(false);
      setSuccess(false);
      return false;
    }
  };

  return {
    removeCustomField,
    loading,
    needsForce,
    setNeedsForce,
    error,
    setError,
    success,
    setSuccess,
  };
}
