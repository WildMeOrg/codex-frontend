import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash-es';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Uppy from '@uppy/core';
import Transloadit from '@uppy/transloadit';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import {
  transloaditKey,
  transloaditTemplateId,
  transloaditService,
} from '../../constants/apiKeys';

export default function FileInput({ schema, value, onChange }) {
  const intl = useIntl();
  const [uppy, setUppy] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const uppyInstance = Uppy({
      meta: { type: 'test' },
      restrictions: {
        maxNumberOfFiles: 10000000, // 10 MB
        maxFileSize: 100,
        allowedFileTypes: schema.allowedFileTypes || null,
      },
      autoProceed: true,
    });

    uppyInstance.use(Transloadit, {
      service: transloaditService,
      params: {
        auth: { key: transloaditKey },
        template_id: transloaditTemplateId,
      },
      waitForEncoding: false,
      waitForMetadata: false,
      importFromUploadURLs: false,
      alwaysRunAssembly: false,
      signature: null,
      fields: {},
      limit: 0,
    });

    uppyInstance.on('complete', uppyState => {
      const uploadObject = get(uppyState, 'successful.0');
      if (uploadObject) onChange(uploadObject);
    });

    setUppy(uppyInstance);

    return () => uppyInstance.close();
  }, []);

  const allowedFileTypeString = schema.allowedFileTypes ? schema.allowedFileTypes.join(', ') : null;

  return (
    <div>
      {!value && (
        <Button
          size="small"
          variant="outlined"
          onClick={() => setModalOpen(true)}
        >
          <FormattedMessage id="UPLOAD_A_FILE" />
        </Button>
      )}
      {value && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography>{value.name}</Typography>
          <IconButton
            size="small"
            onClick={() => {
              onChange(null);
              uppy.reset();
            }}
          >
            <DeleteIcon style={{ color: '#DC2113' }} />
          </IconButton>
        </div>
      )}
      {uppy && (
        <DashboardModal
          uppy={uppy}
          note={allowedFileTypeString ? intl.formatMessage({ id: 'FILETYPES_NOTE' }, { allowedFileTypes: allowedFileTypeString }) : null}
          closeAfterFinish
          closeModalOnClickOutside
          showProgressDetails
          showLinkToFileUploadResult={false}
          open={modalOpen}
          onRequestClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
