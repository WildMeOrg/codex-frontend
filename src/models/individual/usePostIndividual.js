import { useHistory } from 'react-router-dom';

import { usePost } from '../../hooks/useMutate';

export default function usePostIndividual() {
  const history = useHistory();

  return usePost({
    url: '/individuals/',
    deriveData: ({ individualData, encounterGuids }) => ({
      ...individualData,
      encounters: encounterGuids.map(guid => ({ id: guid })),
    }),
    onSuccess: response => {
      const newIndividualGuid = response?.data?.guid;

      if (newIndividualGuid) {
        history.push(`/individuals/${newIndividualGuid}`);
      }
    },
  });
}
