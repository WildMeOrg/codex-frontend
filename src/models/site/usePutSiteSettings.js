import { useContext, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { AppContext, setSiteSettingsNeedsFetch } from '../../context';
import { formatError } from '../../utils/formatters';

export default function usePutSiteSettings() {
  const { dispatch } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const putSiteSettings = async data => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${__houston_url__}/api/v1/configuration/default`,
        withCredentials: true,
        method: 'post',
        data,
      });
      const successful = get(response, ['data', 'success'], false);
      setLoading(false);
      if (successful) {
        dispatch(setSiteSettingsNeedsFetch(true));
        setSuccess(true);
        setError(null);
      } else {
        setError(formatError(response));
        setSuccess(false);
      }
    } catch (postError) {
      setLoading(false);
      setError(formatError(postError));
      setSuccess(false);
    }
  };

  const putSiteSetting = async (property, data) => {
    try {
      const response = await axios({
        url: `${__houston_url__}/api/v1/configuration/default/${property}`,
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
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
