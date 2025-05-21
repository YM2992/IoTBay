export const strictEmailRegex =
  /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const numberRegex = /^\d*$/;

export const getImageSrc = (img) => {
  if (!img) return "/assets/products/default_image.jpg";
  const isURL = img.startsWith("http://") || img.startsWith("https://");
  if (isURL) return img;
  return `/assets/products/${img}.jpg`;
};

export const getExpiryDateStatus = (expiryDate) => {
  const [month, year] = expiryDate.split("/");
  const expiryDateObj = new Date(`20${year}`, month - 1);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  expiryDateObj.setMonth(expiryDateObj.getMonth() + 1);
  expiryDateObj.setDate(0);
  expiryDateObj.setHours(23, 59, 59, 999);
  return expiryDateObj < currentDate ? "Expired" : "Active";
};