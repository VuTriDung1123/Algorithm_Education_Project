import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateLis(nums: number[]): Generator<DSAnimationStep> {
    const n = nums.length;
    if (n === 0) return;
    
    const tableState: DPTableState = {
        table: [Array(n).fill(null).map(() => ({ value: 1, state: 'DEFAULT' }))],
        colLabels: nums.map((v, i) => `[${i}]:${v}`)
    };

    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: "Khởi tạo DP array toàn số 1", codeLine: 1 };

    let maxOverall = 1;
    for (let i = 1; i < n; i++) {
        tableState.table[0][i].state = 'SELECTED';
        for (let j = 0; j < i; j++) {
            tableState.table[0][j].state = 'COMPARE';
            yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Xét nums[${i}]=${nums[i]} và nums[${j}]=${nums[j]}`, codeLine: 4 };
            
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
    
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Hoàn thành! Max LIS = ${maxOverall}`, codeLine: 10 };
}
