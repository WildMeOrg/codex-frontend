import React from 'react';
import { get, some } from 'lodash-es';

import useRequestCollaboration from '../models/collaboration/useRequestCollaboration';
import useGetMe from '../models/users/useGetMe';
import Button from './Button';

export default function RequestCollaborationButton({ otherUserId }) {
  const {
    mutate: requestCollaboration,
    loading: requestCollaborationLoading,
  } = useRequestCollaboration();
  const {
    data: currentUserData,
    loading: userDataLoading,
    isFetching: userDataFetching,
  } = useGetMe();

  const spinButton =
    requestCollaborationLoading ||
    userDataLoading ||
    userDataFetching;

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
        await requestCollaboration({ userGuid: otherUserId });
      }}
      loading={spinButton}
      display={matchingCollaborationPending ? 'tertiary' : 'primary'}
      disabled={spinButton || matchingCollaborationPending}
      id={
        matchingCollaborationPending
          ? 'COLLABORATION_PENDING'
          : 'COLLABORATE'
      }
    />
  );
}
