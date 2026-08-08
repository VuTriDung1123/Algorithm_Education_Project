import { DSAnimationStep, SearchStateData } from "@/lib/data-structures/types";
export function* linearSearchLogic(arr: number[], target: number): Generator<DSAnimationStep> {
    const searchState: SearchStateData = { array: [...arr], target };
    for (let i = 0; i < arr.length; i++) {
        searchState.current = i;
        yield { arrayState: [], searchState: { ...searchState }, message: `Kiểm tra arr[${i}] = ${arr[i]}`, codeLine: 2 };
        if (arr[i] === target) {
            searchState.found = true;
            searchState.foundIndex = i;
            yield { arrayState: [], searchState: { ...searchState }, message: `Tìm thấy ${target} tại vị trí ${i}!`, codeLine: 3 };
            return;
        }
    }
    searchState.found = false; searchState.current = undefined;
    yield { arrayState: [], searchState: { ...searchState }, message: `Không tìm thấy ${target}`, codeLine: 5 };
}