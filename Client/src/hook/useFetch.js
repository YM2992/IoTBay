import { useEffect, useState, useRef } from "react";

export function useAutoFetch(url, options = {}, { refreshInterval = 0, retry = 0 } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const retryCount = useRef(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Fetch failed");

      const result = await res.json();
      setData(result);
      setError(null);
      retryCount.current = 0;
    } catch (err) {
      setError(err);
      if (retryCount.current < retry) {
        retryCount.current += 1;
        setTimeout(fetchData, 1000 * retryCount.current);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [url]);

  return { data, error, loading, refetch: fetchData };
}
