import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const useFetch = (fetchFunction, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // The fix is here: returning setData
  return { data, loading, error, refetch: fetchData, setData };
};

export default useFetch;