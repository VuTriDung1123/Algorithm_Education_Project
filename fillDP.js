const fs = require('fs');

const dpAlgorithms = [
    {
        id: 'fibonacci',
        name: 'Fibonacci DP',
        libFile: 'fibonacci',
        logic: `import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateFibonacci(n: number): Generator<DSAnimationStep> {
    const tableState: DPTableState = {
        table: [Array(n + 1).fill(0).map(() => ({ value: '', state: 'DEFAULT' }))],
        colLabels: Array.from({length: n + 1}, (_, i) => \`n=\${i}\`)
    };

    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Khởi tạo mảng DP", codeLine: 1 };

    tableState.table[0][0] = { value: 0, state: 'SELECTED' };
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "F(0) = 0", codeLine: 2 };
    
    if (n > 0) {
        tableState.table[0][0].state = 'DEFAULT';
        tableState.table[0][1] = { value: 1, state: 'SELECTED' };
        yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "F(1) = 1", codeLine: 3 };
        tableState.table[0][1].state = 'DEFAULT';
    }

    for (let i = 2; i <= n; i++) {
        tableState.table[0][i - 1].state = 'COMPARE';
        tableState.table[0][i - 2].state = 'COMPARE';
        tableState.table[0][i].state = 'SELECTED';
        yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Đang tính F(\${i}) = F(\${i-1}) + F(\${i-2})\`, codeLine: 5 };

        const val1 = tableState.table[0][i - 1].value as number;
        const val2 = tableState.table[0][i - 2].value as number;
        tableState.table[0][i].value = val1 + val2;
        
        yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`F(\${i}) = \${val1} + \${val2} = \${val1 + val2}\`, codeLine: 6 };

        tableState.table[0][i - 1].state = 'DEFAULT';
        tableState.table[0][i - 2].state = 'DEFAULT';
        tableState.table[0][i].state = 'DEFAULT';
    }
    
    if(n >= 0) tableState.table[0][n].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Hoàn thành! F(\${n}) = \${tableState.table[0][n]?.value}\`, codeLine: 8 };
}
`,
        code: `export const fibonacciSnippets = {
    javascript: \`function fibonacci(n) {
  let dp = new Array(n + 1).fill(0);
  dp[0] = 0;
  if (n > 0) dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}\`
};`
    },
    {
        id: 'lcs',
        name: 'Longest Common Subsequence',
        libFile: 'lcs',
        logic: `import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateLCS(s1: string, s2: string): Generator<DSAnimationStep> {
    const m = s1.length;
    const n = s2.length;
    const tableState: DPTableState = {
        table: Array(m + 1).fill(null).map(() => Array(n + 1).fill(null).map(() => ({ value: '', state: 'DEFAULT' }))),
        rowLabels: ['Ø', ...s1.split('')],
        colLabels: ['Ø', ...s2.split('')]
    };

    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Khởi tạo bảng DP", codeLine: 1 };

    for (let i = 0; i <= m; i++) tableState.table[i][0] = { value: 0, state: 'DEFAULT' };
    for (let j = 0; j <= n; j++) tableState.table[0][j] = { value: 0, state: 'DEFAULT' };
    
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Cơ sở: LCS với chuỗi rỗng = 0", codeLine: 3 };

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            tableState.table[i][j].state = 'SELECTED';
            if (s1[i - 1] === s2[j - 1]) {
                tableState.table[i - 1][j - 1].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Ký tự khớp: \${s1[i-1]} == \${s2[j-1]}. DP[\${i}][\${j}] = DP[\${i-1}][\${j-1}] + 1\`, codeLine: 6 };
                tableState.table[i][j].value = (tableState.table[i - 1][j - 1].value as number) + 1;
                tableState.table[i - 1][j - 1].state = 'DEFAULT';
            } else {
                tableState.table[i - 1][j].state = 'COMPARE';
                tableState.table[i][j - 1].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Ký tự KHÁC: \${s1[i-1]} != \${s2[j-1]}. Max(DP[\${i-1}][\${j}], DP[\${i}][\${j-1}])\`, codeLine: 8 };
                tableState.table[i][j].value = Math.max(tableState.table[i - 1][j].value as number, tableState.table[i][j - 1].value as number);
                tableState.table[i - 1][j].state = 'DEFAULT';
                tableState.table[i][j - 1].state = 'DEFAULT';
            }
            tableState.table[i][j].state = 'DEFAULT';
        }
    }
    
    tableState.table[m][n].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Hoàn thành! LCS dài = \${tableState.table[m][n].value}\`, codeLine: 12 };
}
`,
        code: `export const lcsSnippets = {
    javascript: \`function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}\`
};`
    },
    {
        id: 'knapsack',
        name: 'Knapsack Problem',
        libFile: 'knapsack',
        logic: `import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateKnapsack(weights: number[], values: number[], capacity: number): Generator<DSAnimationStep> {
    const n = weights.length;
    const tableState: DPTableState = {
        table: Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(null).map(() => ({ value: '', state: 'DEFAULT' }))),
        rowLabels: ['Item 0', ...weights.map((w, i) => \`I\${i+1}(w\${w},v\${values[i]})\`)],
        colLabels: Array.from({length: capacity + 1}, (_, i) => \`W=\${i}\`)
    };

    for (let i = 0; i <= n; i++) tableState.table[i][0] = { value: 0, state: 'DEFAULT' };
    for (let w = 0; w <= capacity; w++) tableState.table[0][w] = { value: 0, state: 'DEFAULT' };
    
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Khởi tạo bảng Knapsack DP", codeLine: 1 };

    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            tableState.table[i][w].state = 'SELECTED';
            if (weights[i - 1] <= w) {
                tableState.table[i - 1][w].state = 'COMPARE';
                tableState.table[i - 1][w - weights[i - 1]].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`So sánh: Chọn vs Không chọn (w=\${w})\`, codeLine: 6 };
                const valWithout = tableState.table[i - 1][w].value as number;
                const valWith = (tableState.table[i - 1][w - weights[i - 1]].value as number) + values[i - 1];
                tableState.table[i][w].value = Math.max(valWithout, valWith);
                tableState.table[i - 1][w].state = 'DEFAULT';
                tableState.table[i - 1][w - weights[i - 1]].state = 'DEFAULT';
            } else {
                tableState.table[i - 1][w].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Khối lượng \${weights[i-1]} > \${w}, Không thể chọn\`, codeLine: 9 };
                tableState.table[i][w].value = tableState.table[i - 1][w].value;
                tableState.table[i - 1][w].state = 'DEFAULT';
            }
            tableState.table[i][w].state = 'DEFAULT';
        }
    }
    
    tableState.table[n][capacity].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Max Value = \${tableState.table[n][capacity].value}\`, codeLine: 13 };
}
`,
        code: `export const knapsackSnippets = {
    javascript: \`function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({length: n + 1}, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
            dp[i - 1][w], 
            dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  return dp[n][capacity];
}\`
};`
    },
    {
        id: 'coin-change',
        name: 'Coin Change',
        libFile: 'coinChange',
        logic: `import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateCoinChange(coins: number[], amount: number): Generator<DSAnimationStep> {
    const tableState: DPTableState = {
        table: [Array(amount + 1).fill(null).map(() => ({ value: '∞', state: 'DEFAULT' }))],
        colLabels: Array.from({length: amount + 1}, (_, i) => \`Amt=\${i}\`)
    };

    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Khởi tạo bảng vô cực", codeLine: 1 };
    
    tableState.table[0][0].value = 0;
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "DP[0] = 0", codeLine: 2 };

    for (let i = 1; i <= amount; i++) {
        tableState.table[0][i].state = 'SELECTED';
        let minCoins = Infinity;
        for (const coin of coins) {
            if (i - coin >= 0) {
                tableState.table[0][i - coin].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Thử đồng xu \${coin} cho Amt=\${i}\`, codeLine: 6 };
                
                const val = tableState.table[0][i - coin].value;
                if (val !== '∞' && (val as number) + 1 < minCoins) {
                    minCoins = (val as number) + 1;
                }
                tableState.table[0][i - coin].state = 'DEFAULT';
            }
        }
        
        tableState.table[0][i].value = minCoins === Infinity ? '∞' : minCoins;
        tableState.table[0][i].state = 'DEFAULT';
    }
    
    tableState.table[0][amount].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Hoàn thành! Min Coins = \${tableState.table[0][amount].value}\`, codeLine: 12 };
}
`,
        code: `export const coinChangeSnippets = {
    javascript: \`function coinChange(coins, amount) {
  let dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (let coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}\`
};`
    },
    {
        id: 'lis',
        name: 'Longest Increasing Subsequence',
        libFile: 'lis',
        logic: `import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateLis(nums: number[]): Generator<DSAnimationStep> {
    const n = nums.length;
    if (n === 0) return;
    
    const tableState: DPTableState = {
        table: [Array(n).fill(null).map(() => ({ value: 1, state: 'DEFAULT' }))],
        colLabels: nums.map((v, i) => \`[\${i}]:\${v}\`)
    };

    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Khởi tạo DP array toàn số 1", codeLine: 1 };

    let maxOverall = 1;
    for (let i = 1; i < n; i++) {
        tableState.table[0][i].state = 'SELECTED';
        for (let j = 0; j < i; j++) {
            tableState.table[0][j].state = 'COMPARE';
            yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Xét nums[\${i}]=\${nums[i]} và nums[\${j}]=\${nums[j]}\`, codeLine: 4 };
            
            if (nums[i] > nums[j]) {
                const val = (tableState.table[0][j].value as number) + 1;
                if (val > (tableState.table[0][i].value as number)) {
                    tableState.table[0][i].value = val;
                    if (val > maxOverall) maxOverall = val;
                }
            }
            tableState.table[0][j].state = 'DEFAULT';
        }
        tableState.table[0][i].state = 'DEFAULT';
    }
    
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Hoàn thành! Max LIS = \${maxOverall}\`, codeLine: 10 };
}
`,
        code: `export const lisSnippets = {
    javascript: \`function lengthOfLIS(nums) {
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
}\`
};`
    },
    {
        id: 'edit-distance',
        name: 'Edit Distance',
        libFile: 'editDistance',
        logic: `import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateEditDistance(word1: string, word2: string): Generator<DSAnimationStep> {
    const m = word1.length;
    const n = word2.length;
    const tableState: DPTableState = {
        table: Array(m + 1).fill(null).map(() => Array(n + 1).fill(null).map(() => ({ value: '', state: 'DEFAULT' }))),
        rowLabels: ['Ø', ...word1.split('')],
        colLabels: ['Ø', ...word2.split('')]
    };

    for (let i = 0; i <= m; i++) tableState.table[i][0] = { value: i, state: 'DEFAULT' };
    for (let j = 0; j <= n; j++) tableState.table[0][j] = { value: j, state: 'DEFAULT' };
    
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Khởi tạo hàng/cột 0", codeLine: 3 };

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            tableState.table[i][j].state = 'SELECTED';
            
            if (word1[i - 1] === word2[j - 1]) {
                tableState.table[i - 1][j - 1].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Ký tự khớp. Copy DP[\${i-1}][\${j-1}]\`, codeLine: 7 };
                tableState.table[i][j].value = tableState.table[i - 1][j - 1].value;
                tableState.table[i - 1][j - 1].state = 'DEFAULT';
            } else {
                tableState.table[i - 1][j].state = 'COMPARE';
                tableState.table[i][j - 1].state = 'COMPARE';
                tableState.table[i - 1][j - 1].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Khác nhau. Lấy Min(Chèn, Xóa, Thay) + 1\`, codeLine: 9 };
                
                const deleteOp = tableState.table[i - 1][j].value as number;
                const insertOp = tableState.table[i][j - 1].value as number;
                const replaceOp = tableState.table[i - 1][j - 1].value as number;
                
                tableState.table[i][j].value = Math.min(deleteOp, insertOp, replaceOp) + 1;
                
                tableState.table[i - 1][j].state = 'DEFAULT';
                tableState.table[i][j - 1].state = 'DEFAULT';
                tableState.table[i - 1][j - 1].state = 'DEFAULT';
            }
            tableState.table[i][j].state = 'DEFAULT';
        }
    }
    
    tableState.table[m][n].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Khoảng cách: \${tableState.table[m][n].value}\`, codeLine: 13 };
}
`,
        code: `export const editDistanceSnippets = {
    javascript: \`function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1]
        ) + 1;
      }
    }
  }
  return dp[m][n];
}\`
};`
    },
    {
        id: 'mcm',
        name: 'Matrix Chain Multiplication',
        libFile: 'mcm',
        logic: `import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateMcm(p: number[]): Generator<DSAnimationStep> {
    const n = p.length - 1;
    const tableState: DPTableState = {
        table: Array(n).fill(null).map(() => Array(n).fill(null).map(() => ({ value: '', state: 'DEFAULT' }))),
        rowLabels: Array.from({length: n}, (_, i) => \`M\${i+1}\`),
        colLabels: Array.from({length: n}, (_, i) => \`M\${i+1}\`)
    };

    for (let i = 0; i < n; i++) {
        tableState.table[i][i] = { value: 0, state: 'DEFAULT' };
    }
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Khởi tạo đường chéo = 0", codeLine: 3 };

    for (let len = 2; len <= n; len++) {
        for (let i = 0; i < n - len + 1; i++) {
            let j = i + len - 1;
            tableState.table[i][j].state = 'SELECTED';
            let minOps = Infinity;
            
            yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Đang xét chuỗi M\${i+1} đến M\${j+1}\`, codeLine: 6 };

            for (let k = i; k < j; k++) {
                tableState.table[i][k].state = 'COMPARE';
                tableState.table[k + 1][j].state = 'COMPARE';
                
                const q = (tableState.table[i][k].value as number) + 
                          (tableState.table[k + 1][j].value as number) + 
                          p[i] * p[k + 1] * p[j + 1];
                          
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Thử cắt tại k=\${k+1}. Phép toán = \${q}\`, codeLine: 8 };
                
                if (q < minOps) minOps = q;
                
                tableState.table[i][k].state = 'DEFAULT';
                tableState.table[k + 1][j].state = 'DEFAULT';
            }
            
            tableState.table[i][j].value = minOps;
            tableState.table[i][j].state = 'DEFAULT';
        }
    }
    
    tableState.table[0][n - 1].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Hoàn thành! Min = \${tableState.table[0][n - 1].value}\`, codeLine: 13 };
}
`,
        code: `export const mcmSnippets = {
    javascript: \`function matrixChainOrder(p) {
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
}\`
};`
    },
    {
        id: 'subset-sum',
        name: 'Subset Sum',
        libFile: 'subsetSum',
        logic: `import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateSubsetSum(nums: number[], sum: number): Generator<DSAnimationStep> {
    const n = nums.length;
    const tableState: DPTableState = {
        table: Array(n + 1).fill(null).map(() => Array(sum + 1).fill(null).map(() => ({ value: '', state: 'DEFAULT' }))),
        rowLabels: ['Ø', ...nums.map(num => \`\${num}\`)],
        colLabels: Array.from({length: sum + 1}, (_, i) => \`S=\${i}\`)
    };

    for (let i = 0; i <= n; i++) tableState.table[i][0] = { value: 'T', state: 'DEFAULT' };
    for (let j = 1; j <= sum; j++) tableState.table[0][j] = { value: 'F', state: 'DEFAULT' };
    
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Khởi tạo bảng (T=True, F=False)", codeLine: 3 };

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= sum; j++) {
            tableState.table[i][j].state = 'SELECTED';
            if (j >= nums[i - 1]) {
                tableState.table[i - 1][j].state = 'COMPARE';
                tableState.table[i - 1][j - nums[i - 1]].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`OR giữa (Không lấy) và (Có lấy)\`, codeLine: 7 };
                
                const valWithout = tableState.table[i - 1][j].value === 'T';
                const valWith = tableState.table[i - 1][j - nums[i - 1]].value === 'T';
                tableState.table[i][j].value = (valWithout || valWith) ? 'T' : 'F';
                
                tableState.table[i - 1][j].state = 'DEFAULT';
                tableState.table[i - 1][j - nums[i - 1]].state = 'DEFAULT';
            } else {
                tableState.table[i - 1][j].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Không thể lấy số này, copy từ trên.\`, codeLine: 9 };
                tableState.table[i][j].value = tableState.table[i - 1][j].value;
                tableState.table[i - 1][j].state = 'DEFAULT';
            }
            tableState.table[i][j].state = 'DEFAULT';
        }
    }
    
    tableState.table[n][sum].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: \`Hoàn thành! \${tableState.table[n][sum].value}\`, codeLine: 13 };
}
`,
        code: `export const subsetSumSnippets = {
    javascript: \`function isSubsetSum(set, sum) {
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
}\`
};`
    }
];

function generatePageTemplate(algo) {
    let defaultArgs = '';
    if (algo.libFile === 'fibonacci') defaultArgs = '6';
    else if (algo.libFile === 'lcs') defaultArgs = '"AGGTAB", "GXTXAYB"';
    else if (algo.libFile === 'knapsack') defaultArgs = '[1, 2, 3], [10, 15, 40], 6';
    else if (algo.libFile === 'coinChange') defaultArgs = '[1, 2, 5], 11';
    else if (algo.libFile === 'lis') defaultArgs = '[10, 9, 2, 5, 3, 7, 101, 18]';
    else if (algo.libFile === 'editDistance') defaultArgs = '"horse", "ros"';
    else if (algo.libFile === 'mcm') defaultArgs = '[1, 2, 3, 4]';
    else if (algo.libFile === 'subsetSum') defaultArgs = '[3, 34, 4, 12, 5, 2], 9';

    // Capitalize first letter of libFile for function name
    let funcName = algo.libFile.charAt(0).toUpperCase() + algo.libFile.slice(1);
    
    return \`"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Code2, Activity, Play, RotateCcw } from "lucide-react";
import DPTableView from "@/components/Visualization/DP/DPTableView";
import { DPTableState, DSAnimationStep } from "@/lib/data-structures/types"; 
import { generate\${funcName} } from "@/lib/search/\${algo.libFile}Logic";
import { \${algo.libFile}Snippets } from "@/lib/search/\${algo.libFile}Code";

export default function Page() {
  const [dpData, setDpData] = useState<DPTableState | null>(null);
  const [timeline, setTimeline] = useState<DSAnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const reset = useCallback(() => {
      setDpData(null);
      setTimeline([]);
      setCurrentStep(0);
      setIsAnimating(false);
  }, []);

  const runAnimation = (generator: Generator<DSAnimationStep>) => {
    const steps: DSAnimationStep[] = [];
    for (const step of generator) steps.push(step);
    if (steps.length === 0) return;
    setTimeline(steps);
    setCurrentStep(0);
    setIsAnimating(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnimating && currentStep < timeline.length - 1) {
        timer = setTimeout(() => setCurrentStep(p => p + 1), 600); // 600ms for DP since there are many cells
    } else if (isAnimating && currentStep === timeline.length - 1) {
        setIsAnimating(false);
        const lastStep = timeline[timeline.length - 1];
        if (lastStep.dpTableState) setDpData(lastStep.dpTableState);
    }
    return () => clearTimeout(timer);
  }, [isAnimating, currentStep, timeline]);

  const currentMainDp = isAnimating && timeline.length > 0 && timeline[currentStep].dpTableState ? timeline[currentStep].dpTableState! : dpData;
  const currentMessage = isAnimating && timeline.length > 0 ? timeline[currentStep].message : "Sẵn sàng.";

  const handleRun = () => {
      runAnimation((generate\${funcName} as any)(\${defaultArgs}));
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-950 text-white p-4 md:p-8 relative font-sans">
      <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white gap-2"><ArrowLeft size={20} /> Dashboard</Link>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">\${algo.name}</h1>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 relative overflow-hidden flex flex-col items-center shadow-xl min-h-[400px]">
                {currentMainDp ? (
                    <DPTableView dpState={currentMainDp} />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 italic">Nhấn "Bắt đầu" để tạo Bảng phương án</div>
                )}
            </div>

            <div className="bg-slate-900 border-l-4 border-indigo-500 p-4 rounded-r-xl shadow-lg flex items-center gap-3">
                <Activity size={18} className="text-indigo-400" />
                <p className="font-mono text-slate-200 text-sm">{currentMessage}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6 flex flex-wrap items-center justify-center gap-4">
                <button onClick={handleRun} disabled={isAnimating} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-bold flex items-center gap-2"><Play size={18}/> Bắt đầu</button>
                <div className="h-8 w-px bg-slate-700 mx-4 hidden md:block"></div>
                <button onClick={reset} className="text-slate-500 hover:text-white text-sm flex items-center gap-2"><RotateCcw size={16}/> Reset</button>
            </div>
        </div>

        <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl sticky top-6">
                <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-950">
                    <Code2 size={18} className="text-indigo-400" />
                    <span className="font-bold text-slate-200">Pseudocode</span>
                </div>
                <div className="p-4 bg-[#1e1e1e] overflow-x-auto min-h-[400px]">
                    <table className="w-full border-collapse font-mono text-xs md:text-sm">
                        <tbody>
                            {\${algo.libFile}Snippets.javascript.split('\\n').map((line: string, i: number) => {
                                const isActive = timeline[currentStep]?.codeLine === i + 1;
                                return (
                                    <tr key={i} className={\`\${isActive ? 'bg-yellow-500/20' : ''} transition-colors\`}>
                                        <td className="w-6 text-right pr-3 text-slate-600 border-r border-slate-700/50">{i + 1}</td>
                                        <td className={\`pl-3 whitespace-pre-wrap \${isActive ? 'text-yellow-100 font-bold' : 'text-indigo-200'}\`}>{line}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}\`;
}

// Ensure dir exists
if (!fs.existsSync('src/lib/search')) fs.mkdirSync('src/lib/search', {recursive: true});

for (let algo of dpAlgorithms) {
    fs.writeFileSync(\`src/lib/search/\${algo.libFile}Code.ts\`, algo.code);
    fs.writeFileSync(\`src/lib/search/\${algo.libFile}Logic.ts\`, algo.logic);
    
    const pageDir = \`src/app/dp/\${algo.id}\`;
    if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, {recursive: true});
    fs.writeFileSync(\`\${pageDir}/page.tsx\`, generatePageTemplate(algo));
}
