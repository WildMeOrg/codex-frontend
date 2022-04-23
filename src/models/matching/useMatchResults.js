/* Fake data for now. Will require sightingGuid to fetch results */
export default function useMatchResults() {
  return {
    loading: false,
    error: null,
    data: {
      query_annotations: [
        {
          guid: '19ed520e-5892-4df2-9dfd-d95308911322',
          status: 'complete',
          individual_guid: null,
          algorithms: {
            hotspotter_nosv: {
              scores_by_annotation: [
                {
                  guid: '847e6fd2-f914-479a-b8c9-6f177d8343c2',
                  score: 96.82249767571949,
                  id_finish_time: '2022-04-22 19:16:38',
                },
              ],
              scores_by_individual: [
                {
                  guid: '847e6fd2-f914-479a-b8c9-6f177d8343c2',
                  score: 65.41008993785056,
                  id_finish_time: '2022-04-22 19:16:38',
                },
              ],
            },
          },
        },
      ],
      annotation_data: {
        '19ed520e-5892-4df2-9dfd-d95308911322': {
          viewpoint: 'left',
          individual_guid: null,
          image_url:
            'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*',
          asset_dimensions: {
            width: 640,
            height: 425,
          },
          bounds: {
            rect: [238, 87, 381, 324],
            theta: 0.0,
          },
        },
        '847e6fd2-f914-479a-b8c9-6f177d8343c2': {
          viewpoint: 'left',
          // "encounter_location": "Tiddleywink",
          individual_guid: null,
          image_url:
            'https://media.wired.co.uk/photos/606d9c691e0ddb19555fb809/16:9/w_2992,h_1683,c_limit/dog-unsolicited.jpg',
          asset_dimensions: {
            width: 1000,
            height: 664,
          },
          bounds: {
            rect: [182, 100, 658, 519],
            theta: 0.0,
          },
        },
      },
      individual_data: {},
    },
  };
}
