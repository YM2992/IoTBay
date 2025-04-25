export const API_URL = "http://localhost:8000/api/";

export const urlMaker = (endpoint) => {
  return `${API_URL}${endpoint}`;
};

export const optionMaker = (data, method = "POST", token = null) => {
  return {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchPost = async (endpoint, options) => {
  const response = await fetch(urlMaker(endpoint), options);
  const resData = await response.json();

  if (response.status != 200 || !response.ok) {
    throw new Error(resData.message);
  }
  return resData;
};

export const fetchGet = async (endpoint) => {
  const response = await fetch(urlMaker(endpoint));
  const resData = await response.json();

  if (response.status != 200 || !response.ok) {
    throw new Error(resData.message);
  }

  return resData;
};

export const checkEmail = async (email) => {
  const response = await fetch(`${API_URL}user/checkEmail`, optionMaker({ email }));
  const resData = await response.json();

  if (response.status != 200 || !response.ok) {
    throw new Error(resData.message);
  }

  return resData;
};
