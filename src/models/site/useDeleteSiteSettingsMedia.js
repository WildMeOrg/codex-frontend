import { useContext, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { AppContext, setSiteSettingsNeedsFetch } from '../../context';
import { formatError } from '../../utils/formatters';

export default function useDeleteSiteSettingsMedia() {
  const { dispatch } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const deleteSettingsAsset = async data => {
    console.log('deleteMe got here and data is: ');
    console.log(data);
    try {
      setLoading(true);
      const response = await axios({
        url: `${__houston_url__}/api/v1/site-settings/${data}`,
        withCredentials: true,
        method: 'delete',
      });
      const statusResponse = get(response, 'status');
      const successful =
        statusResponse === 204 || statusResponse === 404; // 404 because if it couldn't be found, it hasn't been persisted yet, but the asset should be removed from the DOM anyway
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
    deleteSettingsAsset,
    loading,
    error,
    setError,
    success,
    setSuccess,
  };
}
