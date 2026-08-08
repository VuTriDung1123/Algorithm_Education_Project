import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* ternarySearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target, left: 0, right: arr.length - 1 };
    yield { arrayState: [], searchState: { ...searchState }, message: 'Ternary Search chia khoảng làm 3 phần', codeLine: 2 };
    
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        searchState.left = left; searchState.right = right;
        let mid1 = left + Math.floor((right - left) / 3);
        let mid2 = right - Math.floor((right - left) / 3);
        searchState.mid = mid1; searchState.current = mid2; // Dùng mid cho mid1, current cho mid2 tạm thời
        
        yield { arrayState: [], searchState: { ...searchState }, message: `Tìm khoảng [${left}, ${right}]. mid1=${mid1}, mid2=${mid2}`, codeLine: 4 };
        
        if (arr[mid1] === target) {
            searchState.found = true; searchState.foundIndex = mid1; searchState.current = undefined;
            yield { arrayState: [], searchState: { ...searchState }, message: `Tìm thấy ${target} tại ${mid1}!`, codeLine: 6 }; return;
        }
        if (arr[mid2] === target) {
            searchState.found = true; searchState.foundIndex = mid2; searchState.mid = undefined;
            yield { arrayState: [], searchState: { ...searchState }, message: `Tìm thấy ${target} tại ${mid2}!`, codeLine: 7 }; return;
        }
        
        if (target < arr[mid1]) {
            right = mid1 - 1;
            yield { arrayState: [], searchState: { ...searchState }, message: `${target} < ${arr[mid1]}, tìm phần trái (right = ${right})`, codeLine: 8 };
        } else if (target > arr[mid2]) {
            left = mid2 + 1;
            yield { arrayState: [], searchState: { ...searchState }, message: `${target} > ${arr[mid2]}, tìm phần phải (left = ${left})`, codeLine: 9 };
        } else {
            left = mid1 + 1; right = mid2 - 1;
            yield { arrayState: [], searchState: { ...searchState }, message: `Tìm phần giữa [${left}, ${right}]`, codeLine: 10 };
        }
    }
    searchState.found = false;
    yield { arrayState: [], searchState: { ...searchState }, message: `Không tìm thấy ${target}`, codeLine: 12 };
}