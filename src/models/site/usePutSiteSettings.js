import { useContext, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { AppContext, setSiteSettingsNeedsFetch } from '../../context';

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
        const serverErrorMessage = get(response, [
          'data',
          'message',
          'details',
        ]);
        setError(serverErrorMessage);
        setSuccess(false);
      }
    } catch (postError) {
      setError(error);
      setSuccess(false);
    }
  };

  return { putSiteSettings, error, setError, success, setSuccess };
}
