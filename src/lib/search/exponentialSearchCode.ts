export const exponentialSearchSnippets = {
  javascript: `function exponentialSearch(arr, target) {
  if (arr[0] === target) return 0;
  let i = 1;
  while (i < arr.length && arr[i] <= target) {
    i = i * 2;
  }
  // Binary Search on arr[i/2 ... min(i, arr.length - 1)]
  let left = i / 2, right = Math.min(i, arr.length - 1);
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
};