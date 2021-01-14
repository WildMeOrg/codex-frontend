import { useEffect, useState } from 'react';
import jsonp from 'jsonp';
import { get } from 'lodash-es';

import { formatError } from './formatters';

export default function useItisSearch(searchKey, maxResults = 50) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          jsonp(
            `https://www.itis.gov/ITISWebService/jsonservice/searchForAnyMatchPaged?srchKey=${searchKey}&pageSize=${maxResults}&pageNum=1&ascend=true`,
            {
              timeout: 25000,
              param: 'jsonp',
            },
            (err, response) => {
              if (err) setError(err);

              const results = get(response, 'anyMatchList');
              const formattedResults = results.map(result => {
                const commonNameList = get(
                  result,
                  ['commonNameList', 'commonNames'],
                  [],
                );
                const commonNames = commonNameList.map(entry =>
                  get(entry, 'commonName', ''),
                );

                return {
                  scientificName: result.sciName,
                  tsn: result.tsn,
                  commonNames: commonNames.filter(name => name),
                };
              });

              if (response) setData(formattedResults);
              setLoading(false);
            },
          );
        } catch (fetchError) {
          setError(formatError(fetchError));
          setLoading(false);
          console.error('Error searching ITIS records');
          console.error(fetchError);
        }
      };

      if (searchKey) fetchData();
    },
    [searchKey, maxResults],
  );

  return { data, loading, error };
}
