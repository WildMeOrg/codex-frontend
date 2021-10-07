import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactPlayer from 'react-player';
import { v4 as uuid } from 'uuid';
import Paper from '@material-ui/core/Paper';
import VideoIcon from '@material-ui/icons/Movie';

import ActionIcon from '../ActionIcon';
import Button from '../Button';
import useDeleteSiteSettingsMedia from '../../models/site/useDeleteSiteSettingsMedia';
import Text from '../Text';
import CustomAlert from '../Alert';
import ConfirmDelete from '../ConfirmDelete';

export default function MediaViewer({
  variant = 'image',
  url,
  label,
  includeDeleteButton = false,
  settingKey,
  setPreviewUrl,
  setPreviewText,
}) {
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [
    shouldOpenConfirmDeleteDialog,
    setShouldOpenConfirmDeleteDialog,
  ] = useState(false);
  const {
    deleteSettingsAsset,
    error,
    success: localSuccess,
  } = useDeleteSiteSettingsMedia();
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
  if (variant === 'image' && url) {
    return (
      <div key={url + uuid()}>
        <img
          alt={label}
          style={{
            maxHeight: 240,
            maxWidth: 240,
            height: 'auto',
            width: 'auto',
          }}
          src={url}
        />
        {includeDeleteButton && [
          <Button
            key={
              url + uuid() // nested ActionIcon in Button b/c Button has loading prop
            }
            loading={loading}
            style={{ border: 'none', backgroundColor: 'transparent' }}
          >
            <ActionIcon
              key={url + uuid()}
              variant="delete"
              style={{
                position: 'absolute',
                height: '20px',
                padding: 0,
              }}
              onClick={() => setShouldOpenConfirmDeleteDialog(true)}
            />
          </Button>,
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
              });
            }}
          />,
        ]}
      </div>
    );
  } else if (variant === 'video' && url) {
    return (
      <div key={url + uuid()} style={{ position: 'relative' }}>
        <ReactPlayer
          url={url}
          height={240}
          width={360}
          muted
          autoPlay
          playing
          controls
        />
        {includeDeleteButton && [
          <Button
            key={
              url + uuid() // nested ActionIcon in Button b/c Button has loading prop
            }
            loading={loading}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              marginTop: 8,
              marginBottom: 8,
              position: 'absolute',
            }}
          >
            <ActionIcon
              key={url + uuid()}
              variant="delete"
              style={{
                // position: 'absolute',
                height: '20px',
                padding: 0,
              }}
              onClick={() => setShouldOpenConfirmDeleteDialog(true)}
            />
          </Button>,
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
              });
            }}
          />,
        ]}
      </div>
    );
  } else if (variant === 'video' && !url) {
    return (
      <div key={uuid()}>
        <Paper
          style={{
            display: 'flex',
            padding: 20,
            alignItems: 'center',
          }}
        >
          <VideoIcon style={{ marginRight: 8 }} fontSize="large" />
          <Text variant="subtitle1">
            {label || 'Filename unavailable'}
          </Text>
        </Paper>
        {includeDeleteButton && [
          <Button
            key={
              url + uuid() // nested ActionIcon in Button b/c Button has loading prop
            }
            loading={loading}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              margin: 8,
            }}
          >
            <ActionIcon
              key={url + uuid()}
              variant="delete"
              style={{
                position: 'absolute',
                height: '20px',
                padding: 0,
              }}
              onClick={() => setShouldOpenConfirmDeleteDialog(true)}
            />
          </Button>,
          <ConfirmDelete
            key={url + uuid()}
            open={Boolean(shouldOpenConfirmDeleteDialog)}
            title={<FormattedMessage id="REMOVE_FILE" />}
            messageId="CONFIRM_DELETE_FILE"
            onClose={onCloseConfirmDelete}
            onDelete={() => {
              onCloseConfirmDelete();
              setPreviewUrl(null);
              setPreviewText(null);
            }}
          />,
        ]}
      </div>
    );
  }

  return <Text>{label}</Text>;
}
