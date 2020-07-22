import { useContext } from 'react';
import axios from 'axios';
import { AppContext, setSiteSettingsNeedsFetch } from '../../context';

export default function usePutSiteSettings(data) {
  const { dispatch } = useContext(AppContext);

  const putData = async () => {
    try {
      const response = await axios({
        url: 'https://nextgen.dev-wildbook.org/api/v0/configuration',
        withCredentials: true,
        method: 'post',
        data,
      });
      dispatch(setSiteSettingsNeedsFetch(true));
      console.log(response);
    } catch (postError) {
      console.error('Error updating site settings');
      console.error(postError);
    }
  };

  return putData;
}
