import { useContext, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { AppContext, setSiteSettingsNeedsFetch } from '../../context';
import { formatError } from '../../utils/formatters';

export default function usePostSettingsAsset() {
  const { dispatch } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const postSettingsAsset = async data => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${__houston_url__}/api/v1/site-settings/`,
        withCredentials: true,
        method: 'post',
        data,
      });
      const successful = get(response, 'status') === 200;
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

  return {
    postSettingsAsset,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
