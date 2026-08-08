import { DPTableState, DSAnimationStep } from '../data-structures/types';

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
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Ký tự khớp. Copy DP[${i-1}][${j-1}]`, codeLine: 7 };
                tableState.table[i][j].value = tableState.table[i - 1][j - 1].value;
                tableState.table[i - 1][j - 1].state = 'DEFAULT';
            } else {
                tableState.table[i - 1][j].state = 'COMPARE';
                tableState.table[i][j - 1].state = 'COMPARE';
                tableState.table[i - 1][j - 1].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Khác nhau. Lấy Min(Chèn, Xóa, Thay) + 1`, codeLine: 9 };
                
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
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Khoảng cách: ${tableState.table[m][n].value}`, codeLine: 13 };
}
