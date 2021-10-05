import React, { useEffect, useState, useMemo } from 'react';
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
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import VideoIcon from '@material-ui/icons/Movie';

import ActionIcon from '../ActionIcon';
import Button from '../Button';
import useSiteSettings from '../../models/site/useSiteSettings';
import Text from '../Text';
import StandardDialog from '../StandardDialog';
import CustomAlert from '../Alert';
import ConfirmDelete from '../ConfirmDelete';

// function deleteMeWrapperFn(assetSubmissionId) {
//   console.log(
//     'deleteMe got here deleteMeWrapperFn entered and assetSubmissionId is: ' +
//       assetSubmissionId,
//   );
//   // const [deleteAsset, setDeleteAsset] = useState(null);
//   // setDeleteAsset(assetSubmissionId);
//   return (
//     <StandardDialog // TODO tailor the below for SettingFileUpload remove
//       maxWidth="xl"
//       open
//       onClose={onClose}
//       titleId={titleId}
//     >
//       <DialogContent>
//         <div style={{ width: 900, padding: '0 40px' }}>
//           <div
//             id="editor-bbox-annotator-container"
//             style={{ zIndex: 999 }}
//             ref={divRef}
//           />
//           {!disableDelete && (
//             <div style={{ margin: '8px 0' }}>
//               {confirmDelete ? (
//                 <Text id="DELETE_ANNOTATION_CONFIRMATION" /> // TODO use CONFIRM_DELETE_SETTINGS_FILE_UPLOAD?
//               ) : (
//                 <Button
//                   onClick={() => setConfirmDelete(true)}
//                   style={{ color: 'red' }}
//                   id="DELETE_THIS_ANNOTATION" // TODO use CONFIRM_DELETE_SETTINGS_FILE_UPLOAD?
//                 />
//               )}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//       <DialogActions
//         style={{
//           padding: '0px 24px 24px 24px',
//           display: 'flex',
//           alignItems: 'flex-end',
//           flexDirection: 'column',
//         }}
//       >
//         {error && (
//           <CustomAlert
//             style={{ margin: '20px 0', width: '100%' }}
//             severity="error"
//             titleId="SERVER_ERROR"
//           >
//             {error}
//           </CustomAlert>
//         )}
//         <div>
//           <Button display="basic" onClick={onClose} id="CANCEL" />
//           <Button
//             display="primary"
//             onClick={() => onChange(rect)}
//             loading={loading}
//             id="SAVE"
//           />
//         </div>
//       </DialogActions>
//     </StandardDialog>
//   );
// }

export default function MediaViewer({
  variant = 'image',
  url,
  label,
  includeDeleteButton = false,
  settingKey,
  data,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteSettingFile, setDeleteSettingFile] = useState(false);
  const onCloseConfirmDelete = () => {
    if (error) setError(null);
    setConfirmDelete(null);
  };
  console.log('deleteMe data inside media viewer is: ');
  console.log(data);
  console.log('deleteMe settingKey is: ');
  console.log(settingKey);

  if (variant === 'image') {
    return (
      <div>
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
            variant="delete"
            style={{
              position: 'absolute',
              height: '20px',
              padding: 0,
            }}
            onClick={() => setDeleteSettingFile(true)}
          />,
          <ConfirmDelete
            open={
              Boolean(deleteSettingFile)
              //   const response = await axios({
              //     url: `${__houston_url__}/api/v1/site-settings/${settingKey}`,
              //     withCredentials: true,
              //     method: 'delete',
              //   });
              //   console.log('deleteMe response is: ');
              //   console.log(response);
            }
            title={
              <FormattedMessage id="REMOVE_FILE" /> // onClose={onCloseConfirmDelete}
            }
            messageId={<FormattedMessage id="CONFIRM_DELETE_FILE" />} // message={<FormattedMessage id="CONFIRM_DELETE_FILE" />}
            onClose={onCloseCategoryDialog}
            onDelete={async () => {
              const response = await axios({
                url: `${__houston_url__}/api/v1/site-settings/${settingKey}`,
                withCredentials: true,
                method: 'delete',
              });
              console.log('deleteMe response is: ');
              console.log(response);
              // TODO zhuzh this up when there's a better response
              if (response) {
                console.log('hi');
              }
              // const newCustomCategories = removeItemById(
              //   deleteCategory,
              //   customFieldCategories,
              // );
              // putSiteSetting(
              //   categorySettingName,
              //   newCustomCategories,
              // ).then(() => {
              //   onCloseConfirmDelete();
              // });
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
