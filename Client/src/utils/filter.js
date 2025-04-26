export function filterStr(array, paramKey, filterArea) {
  let temp;
  if (paramKey === "all") {
    temp = array;
  } else {
    temp = array.filter((item) => item[filterArea] === paramKey);
  }

  return temp;
}

export function filterIncludes(array, paramKey, filterArea) {
  let temp = array;
  console.log(paramKey.trim());

  if (paramKey.trim() === "all") return temp;
  const trimmedKeyword = paramKey.trim().toLowerCase();

  console.log(array);

  return temp.filter((item) => item[filterArea].toLowerCase().includes(trimmedKeyword));
}

export function filterCompare(array, paramKey, filterArea, max = false) {
  let temp = array;
  if (paramKey === "all") return temp;

  temp = max
    ? array.filter((item) => item[filterArea] <= Number(paramKey))
    : array.filter((item) => item[filterArea] >= Number(paramKey));

  return temp;
}
