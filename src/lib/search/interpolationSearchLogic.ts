import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* interpolationSearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target, left: 0, right: arr.length - 1 };
    yield { arrayState: [], searchState: { ...searchState }, message: 'Interpolation Search: Dự đoán vị trí', codeLine: 2 };
    
    let left = 0, right = arr.length - 1;
    while (left <= right && target >= arr[left] && target <= arr[right]) {
        searchState.left = left; searchState.right = right;
        if (left === right) {
            if (arr[left] === target) {
                searchState.found = true; searchState.foundIndex = left;
                yield { arrayState: [], searchState: { ...searchState }, message: `Tìm thấy tại ${left}!`, codeLine: 5 }; return;
            }
            break;
        }
        
        let pos = left + Math.floor(((target - arr[left]) * (right - left)) / (arr[right] - arr[left]));
        searchState.mid = pos; searchState.current = pos;
        yield { arrayState: [], searchState: { ...searchState }, message: `Dự đoán vị trí (pos) = ${pos}, arr[${pos}] = ${arr[pos]}`, codeLine: 9 };
        
        if (arr[pos] === target) {
            searchState.found = true; searchState.foundIndex = pos;
            yield { arrayState: [], searchState: { ...searchState }, message: `Tìm thấy tại ${pos}!`, codeLine: 10 }; return;
        }
        if (arr[pos] < target) {
            left = pos + 1;
            yield { arrayState: [], searchState: { ...searchState }, message: `${arr[pos]} < ${target}, tìm bên phải (left = ${left})`, codeLine: 11 };
        } else {
            right = pos - 1;
            yield { arrayState: [], searchState: { ...searchState }, message: `${arr[pos]} > ${target}, tìm bên trái (right = ${right})`, codeLine: 12 };
        }
    }
    searchState.found = false;
    yield { arrayState: [], searchState: { ...searchState }, message: `Không tìm thấy ${target}`, codeLine: 14 };
}