import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateMcm(p: number[]): Generator<DSAnimationStep> {
    const n = p.length - 1;
    const tableState: DPTableState = {
        table: Array(n).fill(null).map(() => Array(n).fill(null).map(() => ({ value: '', state: 'DEFAULT' }))),
        rowLabels: Array.from({length: n}, (_, i) => `M${i+1}`),
        colLabels: Array.from({length: n}, (_, i) => `M${i+1}`)
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
            
            yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Đang xét chuỗi M${i+1} đến M${j+1}`, codeLine: 6 };

            for (let k = i; k < j; k++) {
                tableState.table[i][k].state = 'COMPARE';
                tableState.table[k + 1][j].state = 'COMPARE';
                
                const q = (tableState.table[i][k].value as number) + 
                          (tableState.table[k + 1][j].value as number) + 
                          p[i] * p[k + 1] * p[j + 1];
                          
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Thử cắt tại k=${k+1}. Phép toán = ${q}`, codeLine: 8 };
                
                if (q < minOps) minOps = q;
                
                tableState.table[i][k].state = 'DEFAULT';
                tableState.table[k + 1][j].state = 'DEFAULT';
            }
            
            tableState.table[i][j].value = minOps;
            tableState.table[i][j].state = 'DEFAULT';
        }
    }
    
    tableState.table[0][n - 1].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Hoàn thành! Min = ${tableState.table[0][n - 1].value}`, codeLine: 13 };
}
