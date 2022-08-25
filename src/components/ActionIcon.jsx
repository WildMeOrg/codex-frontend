import React from 'react';
import { useIntl } from 'react-intl';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ViewIcon from '@material-ui/icons/Launch';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
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
  revoke: {
    labelId: 'MUTUAL_REVOKE',
    component: RemoveCircleIcon,
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
  removeEncFromIndividual: {
    labelId: 'DETACH_ENCOUNTER_FROM_INDIVIDUAL',
    component: DeleteIcon,
  },
  removeEncFromIndividualDisabled: {
    labelId: 'DETACH_ENCOUNTER_FROM_INDIVIDUAL_DISABLED',
    component: DeleteIcon,
  },
};

const Core = function ({
  variant,
  labelId,
  disabled = false,
  ...rest
}) {
  const intl = useIntl();
  const config = variantMap[variant];
  const label = intl.formatMessage({ id: labelId || config.labelId });
  if (disabled) {
    return (
      <Tooltip title={label}>
        <span>
          <IconButton
            style={{ padding: 4 }}
            aria-label={label}
            disabled={disabled}
            {...rest}
          >
            <config.component />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={label}>
      <IconButton style={{ padding: 4 }} aria-label={label} {...rest}>
        <config.component />
      </IconButton>
    </Tooltip>
  );
};

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
