export const API_URL = "http://localhost:8000/api/";
const successCodes = [200, 201, 204];

export const API_ROUTES = {
  user: {
    login: "user/login",
    register: "user/register",
    checkEmail: "user/checkEmail",
    getUser: "user/getUser",
    updateUser: "user/updateUser",
  },
  product: {
    getProducts: "product/getProducts",
    getProductById: "product/getProductById",
  },
  // new supplier route
  supplier:{
    create: "supplier/",
    getAll: "supplier/",
    getById: (id) => `supplier/${id}`, // Look up item id when delte from data base | Id = dynamic handelling 
    update: (id) => `supplier/${id}`, 
    delete: (id) => `supplier/${id}`    
  },
  payment: {
    getPaymentCards: "payment/card/",
    updatePaymentCard: "payment/card/",
    removePaymentCard: "payment/card/",

    getPaymentHistory: "payment/history/",
    addPayment: "payment/addPayment"
  },
  order: {
    getOrderHistory: "order/history",
    getOrderbyId: (id) => `order/${id}`,
  },
  checkout: {
    checkout: "checkout"
  }
};

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

export const fetchDelete = async (endpoint, options={}) => {
  const response = await fetch(urlMaker(endpoint), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(options.body)
  });
  const resData = await response.json();

  if (response.status != 200 || !response.ok) {
    throw new Error(response.message);
  }
  return resData;
};

export const fetchPost = async (endpoint, options) => {
  const response = await fetch(urlMaker(endpoint), options);
  const resData = await response.json();

  if (!successCodes.includes(response.status) || !response.ok) {
    throw new Error(resData.message);
  }
  return resData;
};

export const fetchGet = async (endpoint, options) => {
  const response = await fetch(urlMaker(endpoint), options);
  const resData = await response.json();

  if (!successCodes.includes(response.status) || !response.ok) {
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


