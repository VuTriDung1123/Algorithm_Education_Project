export type Language = 'Pseudo' | 'C++' | 'C#' | 'Java' | 'Python' | 'Go';

interface CodeSnippet {
  code: string;
  // Map hành động với số dòng cần highlight (Bắt đầu từ 0)
  highlight: {
    COMPARE: number;
    SWAP: number;
  };
}

export const bubbleSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure bubbleSort(arr):
  n = length(arr)
  repeat
    swapped = false
    for i = 1 to n-1 inclusive do
      if arr[i-1] > arr[i] then
        swap(arr[i-1], arr[i])
        swapped = true
      end if
    end for
  until not swapped
end procedure`,
    highlight: { COMPARE: 5, SWAP: 6 } 
  },
  'C++': {
    code: `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
    highlight: { COMPARE: 3, SWAP: 4 }
  },
  'C#': {
    code: `static void BubbleSort(int[] arr) {
    int n = arr.Length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
    highlight: { COMPARE: 4, SWAP: 6 } // C# dòng swap tốn nhiều dòng hơn, ta highlight dòng đầu
  },
  'Java': {
    code: `void bubbleSort(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`,
    highlight: { COMPARE: 4, SWAP: 6 }
  },
  'Python': {
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
    highlight: { COMPARE: 4, SWAP: 5 }
  },
  'Go': {
    code: `func BubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}`,
    highlight: { COMPARE: 4, SWAP: 5 }
  }
};