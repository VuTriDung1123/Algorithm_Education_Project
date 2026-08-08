export const mcmSnippets = {
    javascript: `function matrixChainOrder(p) {
  const n = p.length - 1;
  const m = Array.from({length: n}, () => Array(n).fill(0));

  for (let L = 2; L <= n; L++) {
    for (let i = 0; i < n - L + 1; i++) {
      let j = i + L - 1;
      m[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        let q = m[i][k] + m[k + 1][j] + p[i] * p[k + 1] * p[j + 1];
        if (q < m[i][j]) m[i][j] = q;
      }
    }
  }
  return m[0][n - 1];
}`
};