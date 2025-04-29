export const API_URL = "http://localhost:8000/api/";

export const urlMaker = (endpoint) => {
  return `${API_URL}${endpoint}`;
};

export const optionMaker = (data, method = "POST") => {
  const option = {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  };
  return option;
};

export const fetchPost = async (endpoint, options={}) => {
  const response = await fetch(urlMaker(endpoint), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(options.body),
  });

  if (response.status != 200 || !response.ok) {
    console.error(response);
    return null;
  }
  const resData = await response.json();
  return resData;
};

export const fetchGet = async (endpoint, options={}) => {
  const response = await fetch(urlMaker(endpoint), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options
  });
  if (response.status != 200 || !response.ok) {
    console.error(response);
    return null;
  }
  const resData = await response.json();
  return resData;
};

export const fetchDelete = async (endpoint, options) => {
  const response = await fetch(urlMaker(endpoint), {
    method: "DELETE",
    ...options
  });

  if (response.status != 200 || !response.ok) {
    console.error(response);
    return null;
  }
  const resData = await response.json();
  return resData;
};

export const checkEmail = async (email) => {
  const response = await fetch(`${API_URL}user/checkEmail`, optionMaker({ email }));

  if (response.status != 200 || !response.ok) {
    console.error(response);
    return null;
  }

  const resData = await response.json();
  return resData;
};
