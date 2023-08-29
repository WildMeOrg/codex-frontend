import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import Button from '../../components/Button';
import Text from '../../components/Text';
import { useGetAuditLogs } from '../../models/auditLogs/useGetAuditLogs';

export default function AuditLog() {
  const [inputValue, setInputValue] = useState('');
  const [auditLogId, setAuditLogId] = useState(null);
  const { data, isLoading, error } = useGetAuditLogs(auditLogId);

  const stringifiedData = JSON.stringify(data, undefined, 2);
  return (
    <div
      style={{
        paddingTop: 100,
        minHeight: '100vh',
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        marginLeft: 32,
      }}
    >
      <Text variant="h4">Audit log inspector</Text>
      <Paper
        style={{
          width: 660,
          marginTop: 24,
          maxWidth: '90%',
          position: 'relative',
          padding: '12px 16px 20px 16px',
          height: 'min-content',
        }}
      >
        <div
          style={{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            id="entity-guid-input"
            label="Entity GUID"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            style={{ width: 420 }}
          />
          <Button
            display="primary"
            loading={isLoading}
            onClick={() => setAuditLogId(inputValue)}
            style={{ marginLeft: 12 }}
          >
            Go
          </Button>
        </div>
        <pre
          style={{
            marginTop: 20,
            fontSize: 16,
            width: '100%',
            overflow: 'scroll',
            background: error ? '#f5c6c6' : '#e6efff',
          }}
        >
          {stringifiedData || error}
        </pre>
      </Paper>
    </div>
  );
}
