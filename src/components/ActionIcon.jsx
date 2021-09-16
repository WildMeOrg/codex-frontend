import React from 'react';
import { useIntl } from 'react-intl';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ViewIcon from '@material-ui/icons/Launch';
import DeleteIcon from '@material-ui/icons/Delete';
import DownloadIcon from '@material-ui/icons/GetApp';
import CopyIcon from '@material-ui/icons/FileCopy';

import Link from './Link';

const variantMap = {
  edit: {
    labelId: 'EDIT',
    component: EditIcon,
  },
  view: {
    labelId: 'VIEW',
    component: ViewIcon,
  },
  delete: {
    labelId: 'DELETE',
    component: DeleteIcon,
  },
  download: {
    labelId: 'DOWNLOAD',
    component: DownloadIcon,
  },
  copy: {
    labelId: 'COPY',
    component: CopyIcon,
  },
};

function Core({ variant, labelId, ...rest }) {
  const intl = useIntl();
  const config = variantMap[variant];
  const label = intl.formatMessage({ id: labelId || config.labelId });

  return (
    <Tooltip title={label}>
      <IconButton style={{ padding: 4 }} aria-label={label} {...rest}>
        <config.component />
      </IconButton>
    </Tooltip>
  );
}

export default function ActionIcon({ href, linkProps, ...rest }) {
  if (href) {
    return (
      <Link href={href} {...linkProps}>
        <Core {...rest} />
      </Link>
    );
  }

  return <Core {...rest} />;
}
