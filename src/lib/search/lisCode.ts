export const lisSnippets = {
    javascript: `function lengthOfLIS(nums) {
  if (nums.length === 0) return 0;
  let dp = new Array(nums.length).fill(1);
  let maxAns = 1;
  
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    maxAns = Math.max(maxAns, dp[i]);
  }
  return maxAns;
}`
};