import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateLcs(s1: string, s2: string): Generator<DSAnimationStep> {
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
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Ký tự khớp: ${s1[i-1]} == ${s2[j-1]}. DP[${i}][${j}] = DP[${i-1}][${j-1}] + 1`, codeLine: 6 };
                tableState.table[i][j].value = (tableState.table[i - 1][j - 1].value as number) + 1;
                tableState.table[i - 1][j - 1].state = 'DEFAULT';
            } else {
                tableState.table[i - 1][j].state = 'COMPARE';
                tableState.table[i][j - 1].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Ký tự KHÁC: ${s1[i-1]} != ${s2[j-1]}. Max(DP[${i-1}][${j}], DP[${i}][${j-1}])`, codeLine: 8 };
                tableState.table[i][j].value = Math.max(tableState.table[i - 1][j].value as number, tableState.table[i][j - 1].value as number);
                tableState.table[i - 1][j].state = 'DEFAULT';
                tableState.table[i][j - 1].state = 'DEFAULT';
            }
            tableState.table[i][j].state = 'DEFAULT';
        }
    }
    
    tableState.table[m][n].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Hoàn thành! LCS dài = ${tableState.table[m][n].value}`, codeLine: 12 };
}
