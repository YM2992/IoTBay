// empty template

export function isNineDigitNumber(num) {
  const regex = /^\d{9}$/;
  return regex.test(num);
}
