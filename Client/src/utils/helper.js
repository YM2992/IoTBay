export const strictEmailRegex =
  /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const numberRegex = /^\d*$/;

export const getImageSrc = (img) => {
  if (!img) return "/assets/products/default_image.jpg";
  const isURL = img.startsWith("http://") || img.startsWith("https://");
  if (isURL) return img;
  return `/assets/products/${img}.jpg`;
};
