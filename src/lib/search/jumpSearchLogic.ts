import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* jumpSearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target };
    let n = arr.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    yield { arrayState: [], searchState: { ...searchState }, message: `Bước nhảy (step) = √${n} ≈ ${step}`, codeLine: 3 };
    
    while (arr[Math.min(step, n) - 1] < target) {
        searchState.left = prev; searchState.right = Math.min(step, n) - 1;
        yield { arrayState: [], searchState: { ...searchState }, message: `arr[${searchState.right}] = ${arr[searchState.right]} < ${target}, nhảy tiếp!`, codeLine: 5 };
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) break;
    }
    
    searchState.left = prev; searchState.right = Math.min(step, n) - 1;
    yield { arrayState: [], searchState: { ...searchState }, message: `Dừng nhảy. Khoảng tìm kiếm: [${searchState.left}, ${searchState.right}]`, codeLine: 10 };
    
    while (prev < Math.min(step, n) && arr[prev] < target) {
        searchState.current = prev;
        yield { arrayState: [], searchState: { ...searchState }, message: `Linear search tại ${prev} (arr[${prev}] = ${arr[prev]})`, codeLine: 11 };
        prev++;
    }
    
    searchState.current = prev;
    if (prev < n && arr[prev] === target) {
        searchState.found = true; searchState.foundIndex = prev;
        yield { arrayState: [], searchState: { ...searchState }, message: `Tìm thấy tại ${prev}!`, codeLine: 15 };
    } else {
        searchState.found = false;
        yield { arrayState: [], searchState: { ...searchState }, message: `Không tìm thấy!`, codeLine: 16 };
    }
}