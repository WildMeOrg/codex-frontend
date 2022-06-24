import React, { useMemo } from 'react';

import useOptions from '../../../hooks/useOptions';
import Text from '../../Text';
import OverflowController from './OverflowController';

export default function SpeciesRenderer({
  value,
  noWrap = false,
  ...rest
}) {
  const { speciesOptions } = useOptions();

  const matchingSpeciesLabel = useMemo(
    () => {
      if (!speciesOptions || !value) return '';
      const matchingSpecies = speciesOptions.find(
        species => species?.value === value,
      );
      return matchingSpecies?.label;
    },
    [value, speciesOptions],
  );

  return noWrap ? (
    <OverflowController title={matchingSpeciesLabel}>
      <Text variant="body2" {...rest}>
        {matchingSpeciesLabel}
      </Text>
    </OverflowController>
  ) : (
    <Text variant="body2" {...rest}>
      {matchingSpeciesLabel}
    </Text>
  );
}
