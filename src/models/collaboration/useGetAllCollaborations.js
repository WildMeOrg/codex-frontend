import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useGetAllCollaborations() {
  const [allCollaborationData, setAllCollaborationData] = useState(
    null,
  );
  const [
    getAllCollaborationsError,
    setGetAllCollaborationsError,
  ] = useState(null);
  const [
    getAllCollaborationsLoading,
    setGetAllCollaborationsLoading,
  ] = useState(false);
  const [
    getAllCollaborationsRefreshCount,
    setGetAllCollaborationsRefreshCount,
  ] = useState(0); // TODO decid whether I need this

  useEffect(
    () => {
      const getAllCollaborations = async () => {
        try {
          setGetAllCollaborationsLoading(true);
          const response = await axios.request({
            url: `${__houston_url__}/api/v1/collaborations`,
            method: 'get',
          });
          const responseData = get(response, 'data');
          setAllCollaborationData(responseData);
          setGetAllCollaborationsLoading(false);
        } catch (fetchError) {
          console.log('Error fetching collaborations');
          console.log(fetchError);
          setGetAllCollaborationsError(fetchError);
          setGetAllCollaborationsLoading(false);
        }
      };
      getAllCollaborations();
    },
    [getAllCollaborationsRefreshCount],
  );

  return {
    allCollaborationData,
    getAllCollaborationsLoading,
    getAllCollaborationsError,
    getAllCollaborationsRefreshCount,
  };
}
