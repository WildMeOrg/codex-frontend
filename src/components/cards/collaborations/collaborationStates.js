import { get } from 'lodash-es';

function buildCollaborationPatch(testKey, value) {
  const path =
    testKey === 'viewState' ? '/view_permission' : '/edit_permission';
  return [
    {
      op: 'replace',
      path,
      value,
    },
  ];
}

export default {
  pending: {
    test: (testKey, collaboration) =>
      get(collaboration, ['otherUserData', testKey]) === 'pending',
    currentStateMessage:
      'Access requested. Waiting for your request to be approved.',
    viewDisablesEdit: true,
  },
  waiting: {
    test: (testKey, collaboration) =>
      get(collaboration, ['thisUserData', testKey]) === 'pending',
    currentStateMessage: 'Data access requested.',
    actionMessage: 'Grant access',
    actionVerificationMessage:
      'Are you sure you want to grant access?',
    getActionPatch: testKey =>
      buildCollaborationPatch(testKey, 'approved'),
    actionMessage2: 'Deny access',
    actionVerificationMessage2:
      'Are you sure you want to deny access?',
    getActionPatch2: testKey =>
      buildCollaborationPatch(testKey, 'declined'),
    viewDisablesEdit: true,
  },
  blocked: {
    test: (testKey, collaboration) =>
      ['declined', 'revoked'].includes(
        get(collaboration, ['otherUserData', testKey]),
      ),
    currentStateMessage:
      'Access revoked. Only your collaboration partner can restore access.',
    viewDisablesEdit: true,
  },
  blocking: {
    test: (testKey, collaboration) =>
      ['declined', 'revoked'].includes(
        get(collaboration, ['thisUserData', testKey]),
      ),
    currentStateMessage: 'You have revoked access.',
    actionMessage: 'Restore access',
    actionVerificationMessage:
      'Are you sure you want to restore access? Your data will also become available to your collaboration partner.',
    getActionPatch: testKey =>
      buildCollaborationPatch(testKey, 'approved'),
    viewDisablesEdit: true,
  },
  granted: {
    test: (testKey, collaboration) =>
      get(collaboration, ['otherUserData', testKey]) === 'approved',
    currentStateMessage: 'Access granted.',
    actionMessage: 'Revoke access',
    actionVerificationMessage:
      "Are you sure you want to revoke access? Access to your collaboration partner's data will be revoked as well.",
    getActionPatch: testKey =>
      buildCollaborationPatch(testKey, 'revoked'),
    viewDisablesEdit: false,
  },
  untouched: {
    test: (testKey, collaboration) =>
      get(collaboration, ['otherUserData', testKey]) ===
      'not_initiated',
    currentStateMessage: 'Access has not been requested.',
    actionMessage: 'Request access',
    actionVerificationMessage:
      'Are you sure you want to request access? Your data will also become available to your collaboration partner.',
    getActionPatch: Function.prototype,
    sendEditRequest: true,
    viewDisablesEdit: true,
  },
  confused: {
    test: () => true,
    currentStateMessage:
      'Something went wrong: could not determine collaboration state.',
  },
};
