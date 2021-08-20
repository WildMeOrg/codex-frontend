import { useContext, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { AppContext, setSiteSettingsNeedsFetch } from '../../context';
import { formatError } from '../../utils/formatters';

export default function usePostSettingsAsset() {
  const { dispatch } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const postSettingsAsset = async data => {
    try {
      const response = await axios({
        url: `${__houston_url__}/api/v1/site-settings/`,
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

  return {
    postSettingsAsset,
    error,
    setError,
    success,
    setSuccess,
  };
}
