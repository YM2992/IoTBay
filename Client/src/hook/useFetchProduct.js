import { useEffect, useState } from "react";
import { urlMaker } from "@/api";

const defaultConfig = {
  refreshInterval: 60000,
};

export function useFetchProduct(endpoint, options = {}, config = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { refreshInterval } = { ...defaultConfig, ...config };

  const url = urlMaker(endpoint);

  const fetchData = async () => {
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
