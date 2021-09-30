import React from 'react';
import { get, some } from 'lodash-es';

import useRequestCollaboration from '../models/collaboration/useRequestCollaboration';
import useGetMe from '../models/users/useGetMe';
import Button from './Button';

export default function RequestCollaborationButton({ otherUserId }) {
  const {
    requestCollaboration,
    loading: requestCollaborationLoading,
  } = useRequestCollaboration();
  const {
    data: currentUserData,
    loading: currentUserDataLoading,
    refresh,
  } = useGetMe();

  const loading =
    requestCollaborationLoading || currentUserDataLoading;

  const matchingCollaboration = get(
    currentUserData,
    'collaborations',
    [],
  ).find(collaboration => {
    const collaboratingUserIds = get(collaboration, 'user_guids', []);
    return collaboratingUserIds.includes(otherUserId);
  });

  const matchingCollaborationMembers = Object.values(
    get(matchingCollaboration, 'members', {}),
  );
  const matchingCollaborationPending = some(
    matchingCollaborationMembers,
    m => m.viewState === 'pending',
  );

  if (matchingCollaboration && !matchingCollaborationPending)
    return null;

  return (
    <Button
      onClick={async () => {
        const successful = requestCollaboration(otherUserId);
        if (successful) refresh();
      }}
      loading={loading}
      disabled={matchingCollaborationPending}
      id={
        matchingCollaborationPending
          ? 'COLLABORATION_PENDING'
          : 'ADD_COLLABORATOR'
      }
    />
  );
}
