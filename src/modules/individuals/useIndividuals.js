import { useEffect } from 'react';
import axios from 'axios';

export default function useIndividuals(ids) {
  const individuals = {};

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
                headers: {
                  // Accept: 'application/json',
                  // 'Content-Type': 'application/json',
                  // Cache: 'no-cache',
                },
                data: {},
                withCredentials: true,
                url: `https://nextgen.dev-wildbook.org/api/org.ecocean.MarkedIndividual?individualID==%${id}%27`,
              });
              individuals[id] = result;
            } catch (error) {
              console.log(error);
            }
          });
        } catch (error) {
          console.log('Login error');
          console.log(error);
        }
      };

      fetchData();
    },
    [ids.join(',')],
  );

  return individuals;
}
