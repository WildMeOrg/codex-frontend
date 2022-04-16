import { get } from 'lodash-es';
import { collapseChoices } from '../../../utils/formatters';

// function addAncestors(regions, region, ancestors, inMatchingSubtree) {
//   const descendants = get(regions, locationID, []);
//   if (inMatchingSubtree) {
//     const newAncestors = regions.
//   }
// }

// function getAncestorsFlat(regions, region) {
//   const descendants = get(regions, locationID, []);

// }

export default function buildMatchingSetQuery(regionSchema, region) {
  if (region === '' || !regionSchema) return {};

  /* This is wrong, we need to only match choices that are descendants of the region in question. But for now... */
  const matchRegions = collapseChoices(
    get(regionSchema, 'choices', []),
    0,
  );

  return {
    bool: {
      filter: [
        {
          bool: {
            minimum_should_match: 1,
            should: [
              matchRegions.map(r => ({
                term: {
                  locationId: r?.id,
                },
              })),
            ],
          },
        },
      ],
    },
  };
}
