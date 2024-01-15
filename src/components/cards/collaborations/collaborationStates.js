import { get } from 'lodash-es';

function buildCollaborationPatch(testKey, value) {
  const permissions = {
    viewState: '/view_permission',
    exportState: '/export_permission',
    editState: '/edit_permission',
  };
  const path = permissions[testKey];

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
    viewDisablesExport: true,
    exportDisablesEdit: true,
    test: (testKey, collaboration) =>
      get(collaboration, ['otherUserData', testKey]) === 'pending',
    currentStateMessage:
      'Access requested. Waiting for your request to be approved.',
  },
  waiting: {
    viewDisablesExport: true,
    exportDisablesEdit: true,
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
      buildCollaborationPatch(testKey, 'denied'),
  },
  blocked: {
    viewDisablesExport: true,
    exportDisablesEdit: true,
    test: (testKey, collaboration) =>
      ['denied', 'revoked'].includes(
        get(collaboration, ['otherUserData', testKey]),
      ),
    currentStateMessage:
      'Access revoked. Only the collaboration partner or a user manager can restore access.',
  },
  blocking: {
    viewDisablesExport: true,
    exportDisablesEdit: true,
    test: (testKey, collaboration) =>
      ['denied', 'revoked'].includes(
        get(collaboration, ['thisUserData', testKey]),
      ),
    currentStateMessage: 'You have revoked access.',
    actionMessage: 'Restore access',
    actionVerificationMessage:
      'Are you sure you want to restore access? Your data will also become available to your collaboration partner.',
    getActionPatch: testKey =>
      buildCollaborationPatch(testKey, 'approved'),
  },
  granted: {
    viewDisablesExport: false,
    exportDisablesEdit: false,
    test: (testKey, collaboration) =>
      get(collaboration, ['otherUserData', testKey]) === 'approved',
    currentStateMessage: 'Access granted.',
    actionMessage: 'Revoke access',
    actionVerificationMessage:
      "Are you sure you want to revoke access? Access to your collaboration partner's data will be revoked as well.",
    getActionPatch: testKey =>
      buildCollaborationPatch(testKey, 'revoked'),
  },
  exportRequest: {
    viewDisablesExport: false,
    exportDisablesEdit: true,
    test: (testKey, collaboration) =>
      testKey === 'exportState' &&
      get(collaboration, ['otherUserData', testKey]) ===
        'not_initiated' &&
      get(collaboration, ['otherUserData', 'viewState']) ===
        'approved',
    currentStateMessage: 'Access has not been requested.',
    actionMessage: 'Request access',
    actionVerificationMessage:
      'Are you sure you want to request access? Your data will also become available to your collaboration partner.',
    getActionPatch: Function.prototype,
    sendEditRequest: false,
    sendExportRequest: true,
  },
  exportDisabled: {
    viewDisablesExport: true,
    exportDisablesEdit: true,
    test: (testKey, collaboration) =>
      testKey === 'exportState' &&
      get(collaboration, ['otherUserData', testKey]) ===
        'not_initiated' &&
      get(collaboration, ['otherUserData', 'viewState']) !==
        'approved',
    currentStateMessage: 'Access has not been requested.',
    actionMessage: 'Request access',
    actionVerificationMessage:
      'Are you sure you want to request access? Your data will also become available to your collaboration partner.',
    getActionPatch: Function.prototype,
    sendEditRequest: false,
    sendExportRequest: false,
  },
  editRequest: {
    exportDisablesEdit: false,
    test: (testKey, collaboration) =>
      testKey === 'editState' &&
      get(collaboration, ['otherUserData', testKey]) ===
        'not_initiated' &&
      get(collaboration, ['otherUserData', 'exportState']) ===
        'approved',
    currentStateMessage: 'Access has not been requested.',
    actionMessage: 'Request access',
    actionVerificationMessage:
      'Are you sure you want to request access? Your data will also become available to your collaboration partner.',
    getActionPatch: Function.prototype,
    sendEditRequest: true,
  },
  editDisabled: {
    exportDisablesEdit: true,
    test: (testKey, collaboration) =>
      testKey === 'editState' &&
      get(collaboration, ['otherUserData', testKey]) ===
        'not_initiated' &&
      get(collaboration, ['otherUserData', 'exportState']) !==
        'approved',
    currentStateMessage: 'Access has not been requested.',
    actionMessage: 'Request access',
    actionVerificationMessage:
      'Are you sure you want to request access? Your data will also become available to your collaboration partner.',
    getActionPatch: Function.prototype,
    sendEditRequest: false,
    sendExportRequest: false,
  },
  confused: {
    test: () => true,
    currentStateMessage:
      'Something went wrong: could not determine collaboration state.',
  },
};
