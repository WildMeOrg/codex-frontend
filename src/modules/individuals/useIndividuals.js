import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useIndividuals(ids) {
  const [individuals, setIndividuals] = useState({});
  const [error, setError] = useState(null);

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          await axios(
            'https://nextgen.dev-wildbook.org/api/v0/login?content=%7B%22login%22:%22test%22,%22password%22:%22test1234%22%7D',
          );

          ids.forEach(async id => {
            try {
              const result = await axios({
                withCredentials: true,
                url: `https://nextgen.dev-wildbook.org/api/org.ecocean.MarkedIndividual?individualID==%27${id}%27`,
              });

              const data = get(result, 'data.0');

              individuals[id] = data;
              setIndividuals({ ...individuals });
            } catch (requestError) {
              console.error('Error requesting individual');
              console.error(requestError);
              setError(`Error requesting individual ${id}`);
            }
          });
        } catch (authError) {
          console.error('Login error');
          console.error(authError);
          setError('Error authenticating to API');
        }
      };

      fetchData();
    },
    [ids.join(',')],
  );

  return [individuals, error];
}
