import { useContext, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { AppContext, setSiteSettingsNeedsFetch } from '../../context';
import { formatError } from '../../utils/formatters';

export default function usePutSiteSettings() {
  const { dispatch } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const putSiteSettings = async data => {
    try {
      const response = await axios({
        url: 'https://nextgen.dev-wildbook.org/api/v0/configuration',
        withCredentials: true,
        method: 'post',
        data,
      });
      const successful = get(response, ['data', 'success'], false);
      if (successful) {
        dispatch(setSiteSettingsNeedsFetch(true));
        setSuccess(true);
        setError(null);
      } else {
        setError(formatError(response));
        setSuccess(false);
      }
    } catch (postError) {
      setError(formatError(postError));
      setSuccess(false);
    }
  };

  const putSiteSetting = async (property, data) => {
    try {
      const response = await axios({
        url: `https://nextgen.dev-wildbook.org/api/v0/configuration/${property}`,
        withCredentials: true,
        method: 'post',
        data: {
          _value: data,
        },
      });
      const successful = get(response, ['data', 'success'], false);
      if (successful) {
        dispatch(setSiteSettingsNeedsFetch(true));
        setSuccess(true);
        setError(null);
        return true;
      }

      setError(formatError(response));
      setSuccess(false);
      return false;
    } catch (postError) {
      setError(formatError(postError));
      setSuccess(false);
      return false;
    }
  };

  return {
    putSiteSettings,
    putSiteSetting,
    error,
    setError,
    success,
    setSuccess,
  };
}
