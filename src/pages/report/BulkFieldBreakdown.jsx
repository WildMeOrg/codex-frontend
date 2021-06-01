import React from 'react';
import { get } from 'lodash-es';
import Paper from '@material-ui/core/Paper';

import Text from '../../components/Text';
import useEncounterFieldSchemas from '../../models/encounter/useEncounterFieldSchemas';
import useSightingFieldSchemas from '../../models/sighting/useSightingFieldSchemas';
import {
  bulkImportCategories,
  bulkFieldSchemas,
} from './constants/bulkReportConstants';

const categories = Object.values(bulkImportCategories);

export default function BulkFieldBreakdown({ availableFields }) {
  const sightingFieldSchemas = useSightingFieldSchemas();
  const encounterFieldSchemas = useEncounterFieldSchemas();
  const sightingCustomFields = sightingFieldSchemas
    .filter(schema => schema.customField)
    .map(schema => schema.name);
  const encounterCustomFields = encounterFieldSchemas
    .filter(schema => schema.customField)
    .map(schema => schema.name);
  const schemas =
    sightingFieldSchemas && encounterFieldSchemas
      ? [
          ...sightingFieldSchemas,
          ...encounterFieldSchemas,
          ...bulkFieldSchemas,
        ]
      : null;
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
              sightingCustomFields.includes(f.key)
            )
              return true;
            if (
              cat.name === 'encounter' &&
              encounterCustomFields.includes(f.key)
            )
              return true;
            return false;
          });
          return (
            <div key={cat.name} style={{ marginRight: 120 }}>
              <Text variant="h6">{`${cat.name} fields`}</Text>
              {fieldsInCategory.map(f => {
                const fSchema = schemas.find(
                  schema => schema.name === f.key,
                );
                const label = get(fSchema, 'label', f.key);
                const labelId = get(fSchema, 'labelId');
                return (
                  <Text id={labelId} variant="body2" key={f.key}>
                    {label}
                  </Text>
                );
              })}
            </div>
          );
        })}
      </div>
    </Paper>
  );
}
