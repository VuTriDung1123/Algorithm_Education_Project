export const interpolationSearchSnippets = {
  javascript: `function interpolationSearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right && target >= arr[left] && target <= arr[right]) {
    if (left === right) {
      if (arr[left] === target) return left;
      return -1;
    }
    let pos = left + Math.floor(((target - arr[left]) * (right - left)) / (arr[right] - arr[left]));
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) left = pos + 1;
    else right = pos - 1;
  }
  return -1;
}`
};