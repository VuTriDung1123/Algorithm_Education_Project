import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* exponentialSearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target };
    
    searchState.current = 0;
    yield { arrayState: [], searchState: { ...searchState }, message: 'Kiểm tra arr[0]', codeLine: 2 };
    if (arr[0] === target) {
        searchState.found = true; searchState.foundIndex = 0;
        yield { arrayState: [], searchState: { ...searchState }, message: 'Tìm thấy tại 0!', codeLine: 2 }; return;
    }
    
    let i = 1;
    while (i < arr.length && arr[i] <= target) {
        searchState.current = i;
        yield { arrayState: [], searchState: { ...searchState }, message: `arr[${i}] = ${arr[i]} <= ${target}. Nhân đôi i = ${i*2}`, codeLine: 4 };
        i = i * 2;
    }
    
    let left = i / 2, right = Math.min(i, arr.length - 1);
    searchState.current = undefined; searchState.left = left; searchState.right = right;
    yield { arrayState: [], searchState: { ...searchState }, message: `Phạm vi Binary Search: [${left}, ${right}]`, codeLine: 8 };
    
    while (left <= right) {
        searchState.left = left; searchState.right = right;
        let mid = Math.floor((left + right) / 2);
        searchState.mid = mid; searchState.current = mid;
        yield { arrayState: [], searchState: { ...searchState }, message: `Binary Search: mid=${mid}, arr[${mid}]=${arr[mid]}`, codeLine: 10 };
        
        if (arr[mid] === target) {
            searchState.found = true; searchState.foundIndex = mid;
            yield { arrayState: [], searchState: { ...searchState }, message: `Tìm thấy tại ${mid}!`, codeLine: 12 }; return;
        }
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    searchState.found = false;
    yield { arrayState: [], searchState: { ...searchState }, message: 'Không tìm thấy!', codeLine: 16 };
}