import queryKeys from '../../constants/queryKeys';
import useFetch from '../../hooks/useFetch';

const baseUrl = '/notifications';

export default function useNotifications(includeRead = false) {
  const queryKey = includeRead
    ? queryKeys.allNotifications
    : queryKeys.unreadNotifications;
  return useFetch({
    queryKey,
    url: includeRead ? baseUrl : `${baseUrl}/unread`,
    params: { limit: 100 },
  });
}
