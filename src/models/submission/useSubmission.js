import { useState } from 'react';
import axios from 'axios';
import { get } from 'lodash-es';
import { formatError } from '../../utils/formatters';

export default function useSubmission(title, description) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissionGuid, setSubmissionGuid] = useState(null);
  const [assets, setAssets] = useState(null);

  const createSubmission = async () => {
    try {
      const response = await axios({
        url: `${__houston_url__}/api/v1/submissions/`,
        withCredentials: true,
        method: 'post',
        data: { title, description },
      });
      const guid = get(response, ['data', 'guid'], null);
      if (guid) {
        setSubmissionGuid(guid);
        setError(null);
      } else {
        setError(formatError(response));
      }
    } catch (postError) {
      setError(formatError(postError));
    }
  };

  const submitSubmission = async () => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${__houston_url__}/api/v1/submissions/tus/collect/${submissionGuid}`,
        withCredentials: true,
      });
      const responseAssets = get(response, ['data', 'assets'], null);
      if (responseAssets) {
        setLoading(false);
        setAssets(responseAssets);
        setError(null);
      } else {
        setError(formatError(response));
        setLoading(false);
      }
    } catch (postError) {
      setError(formatError(postError));
      setLoading(false);
    }
  };

  return {
    createSubmission,
    submitSubmission,
    submissionGuid,
    assets,
    loading,
    error,
    setError,
  };
}
