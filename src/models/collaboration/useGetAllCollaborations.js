import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useGetAllCollaborations() {
  const [allCollaborationData, setAllCollaborationData] = useState(
    null,
  );
  const [
    allCollaborationsError,
    setAllCollaborationsError,
  ] = useState(null);
  const [
    allCollaborationsLoading,
    setAllCollaborationsLoading,
  ] = useState(false);
  const [
    allCollaborationsRefreshCount,
    setallCollaborationsRefreshCount,
  ] = useState(0); // TODO decide whether I need this

  useEffect(
    () => {
      const getAllCollaborations = async () => {
        try {
          setAllCollaborationsLoading(true);
          const response = await axios.request({
            url: `${__houston_url__}/api/v1/collaborations`,
            method: 'get',
          });
          const responseData = get(response, 'data');
          setAllCollaborationData(responseData);
          setAllCollaborationsLoading(false);
        } catch (fetchError) {
          console.log('Error fetching collaborations');
          console.log(fetchError);
          setAllCollaborationsError(fetchError);
          setAllCollaborationsLoading(false);
        }
      };
      getAllCollaborations();
    },
    [allCollaborationsRefreshCount],
  );

  return {
    allCollaborationData,
    allCollaborationsLoading,
    allCollaborationsError,
    allCollaborationsRefreshCount,
  };
}
