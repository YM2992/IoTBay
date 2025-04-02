export const API_URL = "http://localhost:8000/api/";

export const fetchPost = async (endpoint, data) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status != 200 || !response.ok) {
    console.error(response);
    return null;
  }
  const resData = await response.json();

  return resData;
};

export const fetchGet = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (response.status != 200 || !response.ok) {
    console.error(response);
    return null;
  }
  const resData = await response.json();
  return resData;
};
