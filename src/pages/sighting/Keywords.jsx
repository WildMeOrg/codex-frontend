import React from 'react';
import { get } from 'lodash-es';
import { FormattedMessage } from 'react-intl';

import { useTheme } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Cancel';

import CustomAlert from '../../components/Alert';
import useDeleteKeyword from '../../models/keyword/useDeleteKeyword';
import { getKeywordColor } from '../../utils/colorUtils';

export default function Keywords({
  annotation,
  deletable = false,
  style,
  children,
  refreshSightingData,
  ...rest
}) {
  const theme = useTheme();
  const annotationId = get(annotation, 'guid');
  const keywords = get(annotation, 'keywords', []);

  const {
    deleteKeyword,
    error: deleteError,
    setError: setDeleteError,
  } = useDeleteKeyword();

  async function onDelete(keywordId) {
    const successful = await deleteKeyword(annotationId, keywordId);
    if (successful) refreshSightingData();
  }

  return (
    <div>
      {deleteError && (
        <CustomAlert
          style={{ marginTop: 16, marginBottom: 8 }}
          severity="error"
          onClose={() => setDeleteError(null)}
          titleId="SERVER_ERROR"
          description={deleteError}
        />
      )}
      <div
        style={{
          marginTop: 4,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          ...style,
        }}
        {...rest}
      >
        {keywords.map(keyword => (
          <Chip
            key={keyword.value}
            style={{
              marginTop: 4,
              marginRight: 4,
              color: theme.palette.common.white,
              backgroundColor: getKeywordColor(keyword.guid),
            }}
            label={keyword.value}
            deleteIcon={
              <DeleteIcon
                style={{ fill: theme.palette.common.white }}
              />
            }
            onDelete={
              deletable ? () => onDelete(keyword.guid) : undefined
            }
          />
        ))}
        {children}
      </div>
    </div>
  );
}
