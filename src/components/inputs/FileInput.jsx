import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { get } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Uppy from '@uppy/core';
import DashboardModal from '@uppy/react/lib/DashboardModal';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import DeleteButton from '../DeleteButton';
import Button from '../Button';

function Core({ children, required, width, style = {} }) {
  return (
    <FormControl
      required={required}
      style={{ width: width || 280, marginBottom: 4, ...style }}
    >
      {children}
    </FormControl>
  );
}

export default function FileInput({
  schema,
  value,
  onChange,
  required,
  width,
  minimalLabels = false, // eslint-disable-line no-unused-vars
  displayType, // eslint-disable-line no-unused-vars
  ...rest
}) {
  const intl = useIntl();
  const [uppy, setUppy] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  function getLabel(object) {
    if (object.labelId)
      return intl.formatMessage({ id: object.labelId });
    return get(object, 'label', 'Missing label');
  }

  function getDescription(object) {
    if (object.descriptionId)
      return intl.formatMessage({ id: object.descriptionId });
    return get(object, 'description', '');
  }

  useEffect(() => {
    let allowedFileTypes = null;
    if (schema.allowedFileTypes) {
      allowedFileTypes =
        schema.allowedFileTypes.length > 0
          ? schema.allowedFileTypes
          : null;
    }
    const uppyInstance = Uppy({
      meta: { type: 'test' },
      restrictions: {
        maxNumberOfFiles: 100,
        maxFileSize: 10000000, // 10 MB
        allowedFileTypes,
      },
      autoProceed: true,
    });

    uppyInstance.on('complete', uppyState => {
      const uploadObject = get(uppyState, 'successful.0');
      if (uploadObject) onChange(uploadObject);
    });

    setUppy(uppyInstance);

    return () => uppyInstance.close();
  }, []);

  const allowedFileTypeString = schema.allowedFileTypes
    ? schema.allowedFileTypes.join(', ')
    : null;

  return (
    <Core required={required} width={width}>
      {!minimalLabels && <Typography>{getLabel(schema)}</Typography>}
      {!minimalLabels && (
        <FormHelperText style={{ marginTop: 0 }}>
          {getDescription(schema)}
        </FormHelperText>
      )}
      {!value && (
        <Button
          size="small"
          style={{ marginTop: 8 }}
          onClick={() => setModalOpen(true)}
          {...rest}
        >
          <FormattedMessage id="UPLOAD_A_FILE" />
        </Button>
      )}
      {value && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {get(value, 'type', '').includes('image') && (
            <img
              alt="Uploaded media"
              style={{
                maxHeight: 120,
                maxWidth: 120,
                height: 'auto',
                width: 'auto',
                padding: 20,
                backgroundColor: schema.dark ? '#1f2640' : 'unset',
              }}
              src={get(value, 'response.uploadURL', null)}
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption">
              {value.name || value}
            </Typography>
            <DeleteButton
              onClick={() => {
                onChange(null);
                uppy.reset();
              }}
            />
          </div>
        </div>
      )}
      {uppy && (
        <DashboardModal
          uppy={uppy}
          note={
            allowedFileTypeString
              ? intl.formatMessage(
                  { id: 'FILETYPES_NOTE' },
                  { allowedFileTypes: allowedFileTypeString },
                )
              : null
          }
          closeAfterFinish
          closeModalOnClickOutside
          showProgressDetails
          showLinkToFileUploadResult={false}
          open={modalOpen}
          onRequestClose={() => setModalOpen(false)}
        />
      )}
    </Core>
  );
}
