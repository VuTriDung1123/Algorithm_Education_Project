import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* binarySearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target, left: 0, right: arr.length - 1 };
    yield { arrayState: [], searchState: { ...searchState }, message: 'Khởi tạo left = 0, right = ' + (arr.length-1), codeLine: 2 };
    
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        searchState.left = left; searchState.right = right;
        yield { arrayState: [], searchState: { ...searchState }, message: `Khoảng tìm kiếm: [${left}, ${right}]`, codeLine: 4 };
        
        let mid = Math.floor((left + right) / 2);
        searchState.mid = mid; searchState.current = mid;
        yield { arrayState: [], searchState: { ...searchState }, message: `mid = ${mid}. Kiểm tra arr[${mid}] = ${arr[mid]}`, codeLine: 5 };
        
        if (arr[mid] === target) {
            searchState.found = true; searchState.foundIndex = mid;
            yield { arrayState: [], searchState: { ...searchState }, message: `Tìm thấy ${target} tại vị trí ${mid}!`, codeLine: 6 };
            return;
        }
        
        if (arr[mid] < target) {
            left = mid + 1;
            yield { arrayState: [], searchState: { ...searchState }, message: `${arr[mid]} < ${target}, tìm nửa phải (left = ${left})`, codeLine: 7 };
        } else {
            right = mid - 1;
            yield { arrayState: [], searchState: { ...searchState }, message: `${arr[mid]} > ${target}, tìm nửa trái (right = ${right})`, codeLine: 8 };
        }
    }
    searchState.found = false; searchState.left = undefined; searchState.right = undefined; searchState.mid = undefined; searchState.current = undefined;
    yield { arrayState: [], searchState: { ...searchState }, message: `Không tìm thấy ${target}`, codeLine: 10 };
}