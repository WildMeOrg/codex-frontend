import { useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../../context';

export default function usePostLogout() {
  const { dispatch } = useContext(AppContext);

  const postLogout = async () => {
    try {
      const response = axios.request({
        url: 'https://houston.dyn.wildme.io/api/v1/auth/revoke',
        method: 'post',
      });
      console.log(response);
    } catch (postError) {
      console.error('Error logging in');
      console.error(postError);
    }
  };

  return postLogout;
}
