import { usePost } from '../../hooks/useMutate';

export default function useMatchAnnotation() {
  return usePost({
    deriveUrl: ({ annotationGuid }) =>
      `/annotations/identify/${annotationGuid}`,
    deriveData: ({ data }) => data,
  });
}
