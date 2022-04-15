import React, { useState, useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { get } from 'lodash-es';

import LocationIdEditor from '../../../components/fields/edit/LocationIdEditor';
import SelectionEditor from '../../../components/fields/edit/SelectionEditor';
import InputRow from '../../../components/fields/edit/InputRow';
import fieldTypes from '../../../constants/fieldTypesNew';
import useSightingFieldSchemas from '../../../models/sighting/useSightingFieldSchemas';

const algorithmSchema = {
  labelId: 'ALGORITHMS',
  descriptionId: 'ALGORITHMS_DESCRIPTION',
  fieldType: fieldTypes.multiselect,
  required: true,
  choices: [
    {
      label: 'Hotspotter',
      value: 'hotspotter_nosv',
    },
    {
      label: 'Groth bitch',
      value: 'whynot',
    },
  ],
};

export default function CustomMatchingSetForm({
  idConfig, // use this to get size!
  setIdConfig,
}) {
  const sightingFieldSchemas = useSightingFieldSchemas();
  const locationIdSchema = useMemo(
    () => {
      if (!sightingFieldSchemas) return null;
      const matchingSchema = sightingFieldSchemas.find(
        schema => schema.name === 'locationId',
      );
      if (!matchingSchema) return null;
      return {
        ...matchingSchema,
        descriptionId: 'REGION_MATCHING_SET_DESCRIPTION',
        required: false,
      };
    },
    [sightingFieldSchemas],
  );

  const [algorithms, setAlgorithms] = useState([]);
  const [region, setRegion] = useState('');

  useEffect(
    () => {
      setIdConfig({
        algorithms,
        matching_set: null,
      });
    },
    [algorithms?.length, region],
  );

  return (
    <>
      <InputRow schema={algorithmSchema}>
        <SelectionEditor
          schema={algorithmSchema}
          minimalLabels
          value={algorithms}
          onChange={setAlgorithms}
        />
      </InputRow>
      <InputRow loading={!locationIdSchema} schema={locationIdSchema}>
        <LocationIdEditor
          schema={locationIdSchema}
          minimalLabels
          value={region}
          onChange={setRegion}
        />
      </InputRow>
    </>
  );
}
