export const subsetSumSnippets = {
    javascript: `function isSubsetSum(set, sum) {
  let n = set.length;
  let dp = Array.from({length: n + 1}, () => Array(sum + 1).fill(false));

  for (let i = 0; i <= n; i++) dp[i][0] = true;
  for (let i = 1; i <= sum; i++) dp[0][i] = false;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= sum; j++) {
      if (j >= set[i - 1]) {
        dp[i][j] = dp[i - 1][j] || dp[i - 1][j - set[i - 1]];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  return dp[n][sum];
}`
};