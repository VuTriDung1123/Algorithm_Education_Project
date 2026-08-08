import { DPTableState, DSAnimationStep } from '../data-structures/types';

export function* generateCoinChange(coins: number[], amount: number): Generator<DSAnimationStep> {
    const tableState: DPTableState = {
        table: [Array(amount + 1).fill(null).map(() => ({ value: '∞', state: 'DEFAULT' }))],
        colLabels: Array.from({length: amount + 1}, (_, i) => `Amt=${i}`)
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
                yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Thử đồng xu ${coin} cho Amt=${i}`, codeLine: 6 };
                
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
    yield { arrayState: [], dpTableState: JSON.parse(JSON.stringify(tableState)), message: `Hoàn thành! Min Coins = ${tableState.table[0][amount].value}`, codeLine: 12 };
}
