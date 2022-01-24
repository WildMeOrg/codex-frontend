import React from 'react';
import { FormattedMessage } from 'react-intl';
import MuiAlert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Text from './Text';

const Core = function({
  descriptionId = '',
  description,
  descriptionValues,
  alertChildren,
  children,
  ...rest
}) {
  return (
    <MuiAlert {...rest}>
      {children},
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {descriptionId ? (
          <FormattedMessage
            id={descriptionId}
            values={descriptionValues}
          />
        ) : (
          description
        )}
        {alertChildren}
      </div>
    </MuiAlert>
  );
};

export default function CustomAlert({
  titleId = '',
  titleTxt,
  titleValues,
  children: alertChildren,
  ...rest
}) {
  const isTitle = titleId || titleTxt;
  return (
    <Core {...rest} alertChildren={alertChildren}>
      {isTitle ? (
        <AlertTitle>
          {titleId ? (
            <Text id={titleId} values={titleValues} />
          ) : (
            <Text>{titleTxt}</Text>
          )}
        </AlertTitle>
      ) : null}
    </Core>
  );
}
