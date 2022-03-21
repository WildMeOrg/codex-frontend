import { useHistory } from 'react-router-dom';

import { usePost } from '../../hooks/useMutate';

export default function useMergeIndividuals() {
  const history = useHistory();

  return usePost({
    deriveUrl: ({ targetIndividualGuid }) =>
      `/individuals/${targetIndividualGuid}/merge`,
    deriveData: ({ fromIndividualGuids, propertyOverrides }) => ({
      fromIndividualIds: fromIndividualGuids,
      parameters: {
        override: propertyOverrides,
      },
    }),
    onSuccess: response => {
      const mergedIndividualGuid = response?.data?.targetId;
      if (mergedIndividualGuid) {
        history.push(`/individuals/${mergedIndividualGuid}`);
      }
    },
  });
}
