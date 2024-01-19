import { useState, useEffect } from "react";
import axios from "axios";

export const ApiHook = (method, url, data = null) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;
        switch (method) {
          case "get":
            result = await axios.get(url);
            break;
          case "post":
            result = await axios.post(url, data);
            break;
          case "patch":
            result = await axios.put(url, data);
            break;
          case "delete":
            result = await axios.delete(url);
            break;
          default:
            throw new Error(`Método no admitido: ${method}`);
        }
        setResponse(result.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [method, url, data]);
  return { response, error };
};
