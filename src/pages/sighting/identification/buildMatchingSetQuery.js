import { flattenDeep, get } from 'lodash-es';

function addChildMatches(rootRegion, matchId, insideRegion) {
  const matchFound = rootRegion?.id === matchId;
  const insideRegionNew = matchFound || insideRegion;
  const parentMatch = insideRegionNew ? [rootRegion] : [];
  const regionDescendants = rootRegion?.locationID || [];

  return [
    ...parentMatch,
    ...regionDescendants.map(descendant =>
      addChildMatches(descendant, matchId, insideRegionNew),
    ),
  ];
}

function getMatchWithChildren(regions, matchId) {
  const matchingRegionTree = regions.map(region => {
    const topLevelMatch = region?.id === matchId;
    const parentMatch = topLevelMatch ? [region] : [];
    const regionDescendants = region?.locationID || [];

    return [
      ...parentMatch,
      ...regionDescendants.map(descendant =>
        addChildMatches(descendant, matchId, topLevelMatch),
      ),
    ];
  });
  return flattenDeep(matchingRegionTree);
}

export default function buildMatchingSetQuery(regionSchema, region) {
  if (region === '' || !regionSchema) return {};

  const regionChoices = get(regionSchema, 'choices', []);
  const matchWithChildren = getMatchWithChildren(
    regionChoices,
    region,
  );

  return {
    bool: {
      filter: [
        {
          bool: {
            minimum_should_match: 1,
            should: matchWithChildren.map(r => ({
              term: {
                locationId: r?.id,
              },
            })),
          },
        },
        {
          bool: '_MACRO_annotation_neighboring_viewpoints_clause',
        },
        {
          exists: { field: 'encounter_guid' },
        },
      ],
      must_not: {
        match: {
          encounter_guid: '_MACRO_annotation_encounter_guid',
        },
      },
    },
  };
}
