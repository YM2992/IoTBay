import { useEffect, useState } from "react";
import { urlMaker } from "@/api";

const defaultConfig = {
  refreshInterval: 60000,
  enable: true,
};

export function useFetch(endpoint, options = {}, config = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshInterval, enable } = { ...defaultConfig, ...config };

  const url = urlMaker(endpoint);

  const fetchData = async () => {
    if (!enable) return;

    try {
      setLoading(true);
      const res = await fetch(url, options);
      if (!res.ok) throw new Error("Fetch failed");

      const { data } = await res.json();
      setData(data);
    } catch (err) {
      setError(err);
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
