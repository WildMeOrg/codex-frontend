import { flattenDeep, get } from 'lodash-es';

function addChildMatches(rootRegion, matchId, insideRegion) {
  const matchFound = rootRegion?.id === matchId;
  const insideRegionNew = matchFound || insideRegion;
  const parentMatch = insideRegionNew ? [rootRegion] : [];
  const children = rootRegion?.locationID || [];

  return [
    ...parentMatch,
    ...children.map(child =>
      addChildMatches(child, matchId, insideRegionNew),
    ),
  ];
}

function getMatchWithChildren(regions, matchId) {
  const matchingRegionTree = regions.map(region => {
    const topLevelMatch = region?.id === matchId;
    const parentMatch = topLevelMatch ? [region] : [];
    const children = region?.locationID || [];

    return [
      ...parentMatch,
      ...children.map(child =>
        addChildMatches(child, matchId, topLevelMatch),
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
      ],
    },
  };
}
