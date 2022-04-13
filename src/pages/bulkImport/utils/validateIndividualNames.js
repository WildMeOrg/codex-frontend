import axios from 'axios';

export default async function validateIndividualNames(names) {
  const response = await axios.request({
    method: 'post',
    url: `${__houston_url__}/api/v1/individuals/validate`,
    data: names,
  });
  return response?.data || [];
}
