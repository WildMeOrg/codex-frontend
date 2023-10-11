import { useEffect, useState } from 'react';
import jsonp from 'jsonp';
import { get, uniqBy } from 'lodash-es';

import { formatError } from './formatters';

export default function useItisSearch(searchKey, maxResults = 50) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        jsonp(
          `https://www.itis.gov/ITISWebService/jsonservice/searchForAnyMatchPaged?srchKey=${searchKey}&pageSize=${maxResults}&pageNum=1&ascend=true`,
          {
            timeout: 60000,
            param: 'jsonp',
          },
          (err, response) => {
            if (err) {
              setError(formatError(err));
              setLoading(false);
              return;
            }

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
                itisTsn: parseInt(result.tsn, 10),
                commonNames: commonNames.filter(name => name),
              };
            });
            const filteredResults = uniqBy(
              formattedResults,
              'itisTsn',
            );

            if (response) setData(filteredResults);
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
  }, [searchKey, maxResults]);

  return { data, loading, error, setError };
}
