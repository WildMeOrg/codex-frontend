import useFetch from "../../hooks/useFetch";
import { getIndividualTermQueryKey } from '../../constants/queryKeys';

export default function useGetUserIndividuals(searchTerm) {
  // console.log('=======================')
  // const query = {
  //   bool: {
  //     minimum_should_match: 1,
  //     should: [
  //       { term: { guid: searchTerm } },
  //       {
  //         query_string: {
  //           query: `*${searchTerm}*`,
  //           fields: ['encounters.sighting'],
  //         },
  //       },
  //     ],
  //   },
  // };
  const query =
  {
    "bool": {
        "filter": [
            {
                "match": {
                    "encounters.sighting": "dbc72f2c-8fd7-4615-896a-ed446335ec9f"
                }
            }
        ],
        "must_not": []
    }
}
  
  // const query = {
  //   bool: {
  //     minimum_should_match: 1,
  //     should: [
  //       { term: { guid: searchTerm } },
  //       {
  //         nested: {
  //           path: "encounters",
  //           query: {
  //             bool: {
  //               should: [
  //                 {
  //                   query_string: {
  //                     query: `*${searchTerm}*`,
  //                     fields: ["sighting"],
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //           inner_hits: {},  // Include this if you want to retrieve the matching nested documents
  //         },
  //       },
  //     ],
  //   },
  // };
  
  

  return useFetch({
    method: 'post',
    url: '/individuals/search',
    queryKey: getIndividualTermQueryKey(searchTerm),
    data: query,
    queryOptions: {
      enabled: Boolean(searchTerm),
    },
  });
}
