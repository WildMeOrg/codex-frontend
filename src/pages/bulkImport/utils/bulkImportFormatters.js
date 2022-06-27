export const formatDuplicateLabel = (currentLabel, key, intl) => {
  let returnLabel = currentLabel;
  if (key.startsWith('custom-sighting'))
    returnLabel = intl.formatMessage(
      {
        id: 'SIGHTINGS_LABEL',
      },
      { label: currentLabel },
    );
  else if (key.startsWith('custom-encounter'))
    returnLabel = intl.formatMessage(
      { id: 'ENCOUTNER_LABEL' },
      { label: currentLabel },
    );
  return returnLabel;
};
