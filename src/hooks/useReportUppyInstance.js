import { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import Tus from '@uppy/tus';
import Uppy from '@uppy/core';
import { get } from 'lodash-es';
import axios from 'axios';

function parseFileGuidFromUploadUrl(uploadUrl) {
  if (!uploadUrl) return '';

  const potentialResourceGuid = uploadUrl
    .split('/')
    .filter(token => token)
    .pop();

  if (!uuidValidate(potentialResourceGuid)) {
    console.error(
      `URL ${uploadUrl} with invalid resource GUID ${potentialResourceGuid}. The resource cannot be deleted.`,
    );
    return '';
  }
  return potentialResourceGuid;
}

export default function useReportUppyInstance(reportType) {
  const [uppy, setUppy] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [files, setFiles] = useState([]);
  const assetSubmissionId = useMemo(uuid, []);

  /* Resolves closure / useEffect issue */
  // https://www.youtube.com/watch?v=eTDnfS2_WE4&feature=youtu.be
  const fileRef = useRef([]);
  fileRef.current = files;

  useEffect(
    () => {
      const uppyInstance = new Uppy({
        meta: { type: reportType },
        restrictions: {
          allowedFileTypes: ['.jpg', '.jpeg', '.png'],
        },
        autoProceed: true,
      });

      uppyInstance.use(Tus, {
        endpoint: `${__houston_url__}/api/v1/tus`,
        headers: {
          'x-tus-transaction-id': assetSubmissionId,
        },
        removeFingerprintOnSuccess: true,
      });

      uppyInstance.on('upload', () => setUploadInProgress(true));

      uppyInstance.on('complete', uppyState => {
        const uploadObjects = get(uppyState, 'successful', []);
        const assetReferences = uploadObjects.map(o => ({
          path: o.name,
          transactionId: assetSubmissionId,
        }));

        setUploadInProgress(false);
        setFiles([...fileRef.current, ...assetReferences]);
      });

      uppyInstance.on('file-removed', (file, reason) => {
        if (reason === 'removed-by-user') {
          const uploadUrl = file?.response?.uploadURL;
          const fileGuid = parseFileGuidFromUploadUrl(uploadUrl);
          if (fileGuid) {
            axios
              .delete(`${__houston_url__}/api/v1/tus/${fileGuid}`, {
                headers: {
                  'x-tus-transaction-id': assetSubmissionId,
                },
              })
              .catch(error => {
                uppyInstance.info(
                  {
                    message: `Error deleting ${file.name}`,
                    details: error.message,
                  },
                  'error',
                  7000,
                );
              });
          }

          const newFiles = fileRef.current.filter(
            f => f.path !== file.name,
          );
          setFiles(newFiles);
        }
      });

      setUppy(uppyInstance);

      return () => {
        if (uppyInstance) uppyInstance.close();
      };
    },
    [reportType, assetSubmissionId],
  );

  return {
    uppy,
    uploadInProgress,
    files,
  };
}
