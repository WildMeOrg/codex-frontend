import { useEffect, useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';

export default function useGetSightings(userId) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);

    function refresh() {
        setRefreshCount(refreshCount + 1);
    }

    useEffect(
        () => {
            const getSightings = async (limit = 20, offset = 0) => {
                try {
                    setLoading(true);
                    const response = await axios.request({
                        url: `${__houston_url__}/api/v1/users/${userId}/sightings`,
                        method: 'get',
                        data: {
                            limit,
                            offset,
                        },
                    });
                    const responseData = get(response, 'data');
                    setData(responseData);
                    setLoading(false);
                } catch (fetchError) {
                    console.error(`Error fetching users/${userId}/sightings`);
                    console.error(fetchError);
                    setError(fetchError);
                    setLoading(false);
                }
            };

            getSightings();
        },
        [refreshCount],
    );

    return { data, loading, error, setError, refresh };
}
