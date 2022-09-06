import React, { useState } from 'react';

import { useTheme } from '@material-ui/core/styles';

import ActionIcon from '../ActionIcon';
import ConfirmDelete from '../ConfirmDelete';
import CustomAlert from '../Alert';
import useDeleteSiteSetting from '../../models/site/useDeleteSiteSetting';

export default function MediaDeleteButton({
  includeDeleteButton = false,
  url,
  variant,
  settingKey,
  setPreviewUrl = Function.prototype,
  setPreviewText = Function.prototype,
  onSetPostData = Function.prototype,
  shouldTryDelete = false,
  children,
  ...rest
}) {
  const [
    shouldOpenConfirmDeleteDialog,
    setShouldOpenConfirmDeleteDialog,
  ] = useState(false);
  const theme = useTheme();

  const {
    mutate: deleteSiteSetting,
    error,
    clearError,
    success: localSuccess,
  } = useDeleteSiteSetting();

  const [dismissed, setDismissed] = useState(false);
  function onCloseConfirmDelete() {
    clearError();
    setShouldOpenConfirmDeleteDialog(false);
  }
  if (dismissed) {
    return null;
  }
  if (localSuccess)
    return (
      <CustomAlert
        style={{ margin: '0px 24px 20px 24px' }}
        titleId="SETTINGS_FILE_DELETE_SUCCESS"
        severity="success"
        onClose={() => {
          setDismissed(true);
        }}
      />
    );

  return (
    <div
      key="first"
      style={{ position: 'relative', width: 'min-content' }}
      {...rest}
    >
      {children}
      {includeDeleteButton && [
        <ActionIcon
          key="second"
          variant="delete"
          onClick={() => setShouldOpenConfirmDeleteDialog(true)}
          style={{
            position: 'absolute',
            right: -28,
            top: -28,
            background: theme.palette.background.default,
            border: '1px solid rgba(0, 0, 0, 0.23)',
          }}
        />,
        <ConfirmDelete
          key="third"
          open={shouldOpenConfirmDeleteDialog}
          titleId="REMOVE_FILE"
          messageId="CONFIRM_DELETE_FILE"
          onClose={onCloseConfirmDelete}
          error={error}
          onDelete={async () => {
            if (shouldTryDelete) {
              const result = await deleteSiteSetting({
                property: settingKey,
              });
              if (result?.status === 204) {
                setPreviewUrl(null);
                setPreviewText(null);
                onSetPostData(null);
                onCloseConfirmDelete();
              }
            } else {
              setPreviewUrl(null);
              setPreviewText(null);
              onSetPostData(null);
            }
          }}
        />,
      ]}
    </div>
  );
}
