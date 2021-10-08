import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { v4 as uuid } from 'uuid';
import { useTheme } from '@material-ui/core/styles';

import ActionIcon from '../ActionIcon';
import ConfirmDelete from '../ConfirmDelete';
import CustomAlert from '../Alert';
import useDeleteSiteSettingsMedia from '../../models/site/useDeleteSiteSettingsMedia';

export default function MediaDeleteButton({
  includeDeleteButton = false,
  url,
  variant,
  settingKey,
  setPreviewUrl = Function.prototype,
  setPreviewText = Function.prototype,
  onSetPostData = Function.prototype,
  children,
  ...rest
}) {
  const [
    shouldOpenConfirmDeleteDialog,
    setShouldOpenConfirmDeleteDialog,
  ] = useState(false);
  const theme = useTheme();
  const {
    deleteSettingsAsset,
    error,
    success: localSuccess,
  } = useDeleteSiteSettingsMedia();
  const [localError, setLocalError] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);
  function onCloseConfirmDelete() {
    if (error) {
      setLocalError(true);
    }
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
  if (localError)
    return (
      <CustomAlert
        style={{ margin: '0px 24px 20px 24px' }}
        severity="error"
        titleId="SERVER_ERROR"
        onClose={() => {
          setDismissed(true);
        }}
      >
        {error}
      </CustomAlert>
    );

  return (
    <div
      key={url + uuid()}
      style={{ position: 'relative', width: 'min-content' }}
      {...rest}
    >
      {children}
      {includeDeleteButton && [
        <ActionIcon
          key={url + uuid()}
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
          key={url + uuid()}
          open={Boolean(shouldOpenConfirmDeleteDialog)}
          title={<FormattedMessage id="REMOVE_FILE" />}
          messageId="CONFIRM_DELETE_FILE"
          onClose={onCloseConfirmDelete}
          onDelete={() => {
            setLoading(true);
            deleteSettingsAsset(settingKey).then(() => {
              onCloseConfirmDelete();
              setPreviewUrl(null);
              setPreviewText(null);
              setLoading(false);
              onSetPostData(null);
            });
          }}
        />,
      ]}
    </div>
  );
}
