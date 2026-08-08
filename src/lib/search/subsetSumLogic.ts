import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateSubsetSum(nums: number[], sum: number): Generator<DSAnimationStep> {
    const n = nums.length;
    const tableState: DPTableState = {
        table: Array(n + 1).fill(null).map(() => Array(sum + 1).fill(null).map(() => ({ value: '', state: 'DEFAULT' }))),
        rowLabels: ['Ø', ...nums.map(num => `${num}`)],
        colLabels: Array.from({length: sum + 1}, (_, i) => `S=${i}`)
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
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `OR giữa (Không lấy) và (Có lấy)`, codeLine: 7 };
                
                const valWithout = tableState.table[i - 1][j].value === 'T';
                const valWith = tableState.table[i - 1][j - nums[i - 1]].value === 'T';
                tableState.table[i][j].value = (valWithout || valWith) ? 'T' : 'F';
                
                tableState.table[i - 1][j].state = 'DEFAULT';
                tableState.table[i - 1][j - nums[i - 1]].state = 'DEFAULT';
            } else {
                tableState.table[i - 1][j].state = 'COMPARE';
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Không thể lấy số này, copy từ trên.`, codeLine: 9 };
                tableState.table[i][j].value = tableState.table[i - 1][j].value;
                tableState.table[i - 1][j].state = 'DEFAULT';
            }
            tableState.table[i][j].state = 'DEFAULT';
        }
    }
    
    tableState.table[n][sum].state = 'FOUND';
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Hoàn thành! ${tableState.table[n][sum].value}`, codeLine: 13 };
}
