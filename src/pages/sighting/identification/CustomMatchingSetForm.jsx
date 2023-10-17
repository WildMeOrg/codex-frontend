import React, { useState, useEffect, useMemo } from 'react';

import LocationIdEditor from '../../../components/fields/edit/LocationIdEditor';
import SelectionEditor from '../../../components/fields/edit/SelectionEditor';
import InputRow from '../../../components/fields/edit/InputRow';
import useIdConfigSchemas from '../../../models/identification/useIdConfigSchemas';
import buildMatchingSetQuery from './buildMatchingSetQuery';

export default function CustomMatchingSetForm({
  // idConfig, // use this to get matching set size!
  setIdConfig,
  nested,
}) {
  const idConfigSchemas = useIdConfigSchemas();

  const [algorithmSchema, regionSchema] = useMemo(() => {
    if (!idConfigSchemas) return [null, null];
    const algorithmsObject = idConfigSchemas.find(
      schema => schema.name === 'algorithms',
    );
    const regionsObject = idConfigSchemas.find(
      schema => schema.name === 'locationId',
    );
    return [algorithmsObject, regionsObject];
  }, [idConfigSchemas]);

  const [algorithms, setAlgorithms] = useState([]);
  const [region, setRegion] = useState('');

  useEffect(() => {
    setIdConfig({
      algorithms,
      matching_set: buildMatchingSetQuery(
        regionSchema,
        region,
        nested,
      ),
    });
  }, [
    setIdConfig,
    algorithms,
    algorithms?.length,
    regionSchema,
    region,
  ]);

  return (
    <>
      <InputRow loading={!algorithmSchema} schema={algorithmSchema}>
        <SelectionEditor
          schema={algorithmSchema}
          minimalLabels
          value={algorithms}
          onChange={setAlgorithms}
        />
      </InputRow>
      <InputRow loading={!regionSchema} schema={regionSchema}>
        <LocationIdEditor
          schema={regionSchema}
          minimalLabels
          value={region}
          onChange={setRegion}
        />
      </InputRow>
    </>
  );
}
