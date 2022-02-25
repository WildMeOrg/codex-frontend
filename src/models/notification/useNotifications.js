import queryKeys from '../../constants/queryKeys';
import useGet from '../../hooks/useGet';

const baseUrl = '/notifications';

export default function useNotifications(includeRead = false) {
  const queryKey = includeRead
    ? queryKeys.allNotifications
    : queryKeys.unreadNotifications;
  return useGet({
    queryKey,
    url: includeRead ? baseUrl : `${baseUrl}/unread`,
  });
}
