import { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuid, validate as uuidValidate } from 'uuid';
import Tus from '@uppy/tus';
import Uppy from '@uppy/core';
import { get } from 'lodash-es';
import axios from 'axios';

function parseFileGuidFromUploadUrl(uploadUrl) {
  if (!uploadUrl) throw new Error('Missing upload URL');

  const potentialResourceGuid = uploadUrl
    .split('/')
    .filter(token => token)
    .pop();

  if (!uuidValidate(potentialResourceGuid)) {
    throw new Error(
      `Upload URL, ${uploadUrl}, has an invalid resource GUID, "${potentialResourceGuid}".`,
    );
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

  useEffect(() => {
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

    uppyInstance.on('file-removed', async (file, reason) => {
      if (reason === 'removed-by-user') {
        const uploadUrl = file?.response?.uploadURL;
        try {
          const fileGuid = parseFileGuidFromUploadUrl(uploadUrl);
          await axios.delete(
            `${__houston_url__}/api/v1/tus/${fileGuid}`,
            {
              headers: {
                'x-tus-transaction-id': assetSubmissionId,
              },
            },
          );
        } catch (error) {
          let errorMessage = `${error.name || 'Error'} deleting ${
            file.name
          }.`;

          if (error.message) errorMessage += ` ${error.message}`;

          console.error(errorMessage);
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
  }, []);

  return {
    uppy,
    uploadInProgress,
    files,
  };
}
