import React, {
  useEffect,
  useState,
  useMemo,
  useContext,
} from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { get } from 'lodash-es';
import ReactPlayer from 'react-player';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { AppContext, setSiteSettingsNeedsFetch } from '../../context';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import VideoIcon from '@material-ui/icons/Movie';

import ActionIcon from '../ActionIcon';
import Button from '../Button';
import useSiteSettings from '../../models/site/useSiteSettings';
import useDeleteSiteSettingsMedia from '../../models/site/useDeleteSiteSettingsMedia';
import Text from '../Text';
import StandardDialog from '../StandardDialog';
import CustomAlert from '../Alert';
import ConfirmDelete from '../ConfirmDelete';

export default function MediaViewer({
  // key,
  variant = 'image',
  url,
  label,
  includeDeleteButton = false,
  settingKey,
}) {
  const { dispatch } = useContext(AppContext);
  const [loading, setLoading] = useState(false); // TODO deleteMe do something with loading
  const [localError, setLocalError] = useState(null); // TODO change to null
  const [
    shouldOpenConfirmDeleteDialog,
    setShouldOpenConfirmDeleteDialog,
  ] = useState(false);
  const {
    deleteSettingsAsset,
    error,
    // loading: localLoading,
    success: localSuccess,
    setSuccess: localSetSuccess,
  } = useDeleteSiteSettingsMedia();
  function onCloseConfirmDelete() {
    // return(
    console.log('deleteMe onCloseConfirmDelete entered');
    console.log('deleteMe error is:');
    console.log(error);
    if (error) {
      setLocalError(true);
    }
    setShouldOpenConfirmDeleteDialog(false);
    // return null;
    // if (error) setLocalError(null);
  }

  if (loading) return <p>Loading...</p>;
  if (localSuccess)
    return (
      <CustomAlert
        style={{ margin: '0px 24px 20px 24px' }}
        titleId="SETTINGS_FILE_DELETE_SUCCES"
      >
        {success}
      </CustomAlert>
    );
  if (localError)
    return (
      <CustomAlert
        style={{ margin: '0px 24px 20px 24px' }}
        severity="error"
        titleId="SERVER_ERROR"
      >
        {error}
      </CustomAlert>
    );
  if (variant === 'image') {
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
          <ActionIcon
            key={url + uuid()}
            variant="delete"
            style={{
              position: 'absolute',
              height: '20px',
              padding: 0,
            }}
            onClick={() => setShouldOpenConfirmDeleteDialog(true)}
          />,
          <ConfirmDelete
            key={url + uuid()}
            open={Boolean(shouldOpenConfirmDeleteDialog)}
            title={<FormattedMessage id="REMOVE_FILE" />}
            messageId="CONFIRM_DELETE_FILE"
            onClose={onCloseConfirmDelete}
            onDelete={() => {
              // setLoading(true);
              deleteSettingsAsset(settingKey).then(() => {
                onCloseConfirmDelete();
                // setLoading(false);
              });
              // )
            }}
          />,
        ]}
      </div>
    );
  } else if (variant === 'video' && url) {
    return (
      <ReactPlayer
        url={url}
        height={240}
        width={360}
        muted
        autoPlay
        playing
        controls
      />
    );
  } else if (variant === 'video' && !url) {
    return (
      <Paper
        style={{ display: 'flex', padding: 20, alignItems: 'center' }}
      >
        <VideoIcon style={{ marginRight: 8 }} fontSize="large" />
        <Text variant="subtitle1">
          {label || 'Filename unavailable'}
        </Text>
      </Paper>
    );
  }

  return <Text>{label}</Text>;
}
