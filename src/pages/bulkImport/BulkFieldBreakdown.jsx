import React from 'react';
import { startsWith } from 'lodash-es';
import Paper from '@material-ui/core/Paper';

import Text from '../../components/Text';
import {
  bulkImportCategories,
  deriveCustomFieldPrefix,
} from './constants/bulkReportConstants';
import categoryTypes from '../../constants/categoryTypes';

const categories = Object.values(bulkImportCategories);

export default function BulkFieldBreakdown({ availableFields }) {
  return (
    <Paper
      elevation={2}
      style={{
        marginTop: 20,
        marginBottom: 12,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
      }}
    >
      <Text
        variant="subtitle2"
        style={{ marginBottom: 12 }}
        id="CHOOSE_FIELDS_DESCRIPTION"
      />
      <div style={{ display: 'flex' }}>
        {categories.map(cat => {
          const fieldsInCategory = availableFields.filter(f => {
            if (cat.fields.includes(f.key)) return true;
            if (
              cat.name === 'sighting' &&
              startsWith(
                f.key,
                deriveCustomFieldPrefix(categoryTypes.sighting),
              )
            )
              return true;
            if (
              cat.name === 'animal' &&
              startsWith(
                f.key,
                deriveCustomFieldPrefix(categoryTypes.encounter),
              )
            )
              return true;
            return false;
          });
          return (
            <div key={cat.name} style={{ marginRight: 120 }}>
              <Text variant="h6">{`${cat.name} fields`}</Text>
              {fieldsInCategory.map(f => (
                <Text variant="body2" key={f.key}>
                  {f.label}
                </Text>
              ))}
            </div>
          );
        })}
      </div>
    </Paper>
  );
}
