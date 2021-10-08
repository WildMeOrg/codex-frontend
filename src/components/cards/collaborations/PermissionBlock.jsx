import React from 'react';

import Button from '../../Button';
import Text from '../../Text';

export default function PermissionBlock({
  title,
  schema,
  setRequest,
  testKey,
  disabled,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '20px 24px 0 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: 40,
          flexShrink: 1,
        }}
      >
        <Text>{title}</Text>
        <Text variant="body2">{schema.currentStateMessage}</Text>
      </div>
      {schema.actionMessage ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            minWidth: '30%',
            flexDirection: 'column',
          }}
        >
          <Button
            style={{ whiteSpace: 'nowrap', marginBottom: 8 }}
            onClick={() => {
              const actionPatch = schema.getActionPatch(
                testKey,
                schema,
              );
              setRequest({ ...schema, actionPatch });
            }}
            disabled={disabled}
          >
            {schema.actionMessage}
          </Button>
          {schema.actionMessage2 && (
            <Button
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => {
                const actionPatch = schema.getActionPatch2(
                  testKey,
                  schema,
                );
                setRequest({
                  ...schema,
                  actionVerificationMessage:
                    schema.actionVerificationMessage2,
                  actionPatch,
                });
              }}
              disabled={disabled}
            >
              {schema.actionMessage2}
            </Button>
          )}
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
