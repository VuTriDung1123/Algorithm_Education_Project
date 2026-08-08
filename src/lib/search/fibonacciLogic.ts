import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateFibonacci(n: number): Generator<DSAnimationStep> {
    const tableState: DPTableState = {
        table: [Array(n + 1).fill(0).map(() => ({ value: '', state: 'DEFAULT' }))],
        colLabels: Array.from({length: n + 1}, (_, i) => `n=${i}`)
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
        yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Đang tính F(${i}) = F(${i-1}) + F(${i-2})`, codeLine: 5 };

        const val1 = tableState.table[0][i - 1].value as number;
        const val2 = tableState.table[0][i - 2].value as number;
        tableState.table[0][i].value = val1 + val2;
        
        yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `F(${i}) = ${val1} + ${val2} = ${val1 + val2}`, codeLine: 6 };

        tableState.table[0][i - 1].state = 'DEFAULT';
        tableState.table[0][i - 2].state = 'DEFAULT';
        tableState.table[0][i].state = 'DEFAULT';
    }
    
    if(n >= 0) tableState.table[0][n].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Hoàn thành! F(${n}) = ${tableState.table[0][n]?.value}`, codeLine: 8 };
}
