import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateKnapsack(weights: number[], values: number[], capacity: number): Generator<DSAnimationStep> {
    const n = weights.length;
    const tableState: DPTableState = {
        table: Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(null).map(() => ({ value: '', state: 'DEFAULT' }))),
        rowLabels: ['Item 0', ...weights.map((w, i) => `I${i+1}(w${w},v${values[i]})`)],
        colLabels: Array.from({length: capacity + 1}, (_, i) => `W=${i}`)
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
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `So sánh: Chọn vs Không chọn (w=${w})`, codeLine: 6 };
                const valWithout = tableState.table[i - 1][w].value as number;
                const valWith = (tableState.table[i - 1][w - weights[i - 1]].value as number) + values[i - 1];
                tableState.table[i][w].value = Math.max(valWithout, valWith);
                tableState.table[i - 1][w].state = 'DEFAULT';
                tableState.table[i - 1][w - weights[i - 1]].state = 'DEFAULT';
            } else {
                tableState.table[i - 1][w].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Khối lượng ${weights[i-1]} > ${w}, Không thể chọn`, codeLine: 9 };
                tableState.table[i][w].value = tableState.table[i - 1][w].value;
                tableState.table[i - 1][w].state = 'DEFAULT';
            }
            tableState.table[i][w].state = 'DEFAULT';
        }
    }
    
    tableState.table[n][capacity].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Max Value = ${tableState.table[n][capacity].value}`, codeLine: 13 };
}
