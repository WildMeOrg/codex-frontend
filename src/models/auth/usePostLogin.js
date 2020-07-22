import { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context';

export default function usePostLogin() {
  const { dispatch } = useContext(AppContext);

  const postLogin = async (username, password) => {
    try {
      const response = axios.request({
        url: 'https://nextgen.dev-wildbook.org/houston/login',
        method: 'post',
        auth: {
          username,
          password,
        },
        data: {
          grant_type: 'client_credentials',
          scope: 'public',
        },
      });
      // dispatch(setSiteSettingsNeedsFetch(true));
      console.log(response);
    } catch (postError) {
      console.error('Error updating site settings');
      console.error(postError);
    }
  };

  return postLogin;
}
