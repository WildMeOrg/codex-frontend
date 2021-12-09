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
  } = useGetMe();

  const loading =
    requestCollaborationLoading || currentUserDataLoading;

  const currentUserCollaborations = get(
    currentUserData,
    'collaborations',
    [],
  );
  const matchingCollaboration = currentUserCollaborations.find(
    collaboration => {
      const memberIds = Object.keys(
        get(collaboration, 'members', {}),
      );
      return memberIds.includes(otherUserId);
    },
  );

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
        await requestCollaboration(otherUserId);
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
