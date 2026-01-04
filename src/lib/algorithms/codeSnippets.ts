export type Language = 'Pseudo' | 'C++' | 'C#' | 'Java' | 'Python' | 'Go';

interface CodeSnippet {
  code: string;
  highlight: {
    COMPARE: number;
    SWAP?: number;   // Dấu ? nghĩa là có thể không có (Insertion Sort ít dùng Swap)
    SHIFT?: number;  // Dành cho Insertion Sort
    INSERT?: number; // Dành cho Insertion Sort
    DIVIDE?: number;     // <--- MỚI: Cho Merge Sort
    MERGE?: number;      // <--- MỚI: Cho Merge Sort
    OVERWRITE?: number;  // <--- MỚI: Cho Merge Sort

  };
}

// --- 1. BUBBLE SORT ---
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
    highlight: { COMPARE: 4, SWAP: 6 } 
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

// --- 2. SELECTION SORT ---
export const selectionSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure selectionSort(arr):
  n = length(arr)
  for i = 0 to n - 2 do
    minIdx = i
    for j = i + 1 to n - 1 do
      if arr[j] < arr[minIdx] then
        minIdx = j
      end if
    end for
    if minIdx != i then
      swap(arr[i], arr[minIdx])
    end if
  end for
end procedure`,
    highlight: { COMPARE: 5, SWAP: 9 }
  },
  'C++': {
    code: `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        if (min_idx != i)
            swap(arr[min_idx], arr[i]);
    }
}`,
    highlight: { COMPARE: 4, SWAP: 7 }
  },
  'C#': {
    code: `void SelectionSort(int[] arr) {
    int n = arr.Length;
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
    highlight: { COMPARE: 5, SWAP: 8 }
  },
  'Java': {
    code: `void selectionSort(int arr[]) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int min_idx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
    highlight: { COMPARE: 5, SWAP: 8 }
  },
  'Python': {
    code: `def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`,
    highlight: { COMPARE: 4, SWAP: 6 }
  },
  'Go': {
    code: `func SelectionSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        minIdx := i
        for j := i + 1; j < n; j++ {
            if arr[j] < arr[minIdx] {
                minIdx = j
            }
        }
        arr[i], arr[minIdx] = arr[minIdx], arr[i]
    }
}`,
    highlight: { COMPARE: 5, SWAP: 8 }
  }
};

// --- 3. INSERTION SORT (MỚI) ---
export const insertionSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure insertionSort(arr):
  for i = 1 to length(arr)-1 do
    key = arr[i]
    j = i - 1
    while j >= 0 and arr[j] > key do
      arr[j + 1] = arr[j]
      j = j - 1
    end while
    arr[j + 1] = key
  end for
end procedure`,
    highlight: { COMPARE: 4, SHIFT: 5, INSERT: 7 }
  },
  'C++': {
    code: `void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    highlight: { COMPARE: 4, SHIFT: 5, INSERT: 8 }
  },
  'C#': {
    code: `void InsertionSort(int[] arr) {
    for (int i = 1; i < arr.Length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    highlight: { COMPARE: 4, SHIFT: 5, INSERT: 8 }
  },
  'Java': {
    code: `void insertionSort(int arr[]) {
    for (int i = 1; i < arr.length; ++i) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
    highlight: { COMPARE: 4, SHIFT: 5, INSERT: 8 }
  },
  'Python': {
    code: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key`,
    highlight: { COMPARE: 4, SHIFT: 5, INSERT: 7 }
  },
  'Go': {
    code: `func InsertionSort(arr []int) {
    for i := 1; i < len(arr); i++ {
        key := arr[i]
        j := i - 1
        for j >= 0 && arr[j] > key {
            arr[j+1] = arr[j]
            j = j - 1
        }
        arr[j+1] = key
    }
}`,
    highlight: { COMPARE: 4, SHIFT: 5, INSERT: 8 }
  }
};


// --- 4. MERGE SORT ---
export const mergeSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure mergeSort(arr, left, right):
  if left < right:
    mid = (left + right) / 2
    mergeSort(arr, left, mid)
    mergeSort(arr, mid+1, right)
    merge(arr, left, mid, right)
  end if
end procedure

procedure merge(arr, left, mid, right):
  // Compare elements from left and right sub-arrays
  // Copy smaller element to arr[k]
  ...
end procedure`,
    highlight: { COMPARE: 10, DIVIDE: 2, MERGE: 5, OVERWRITE: 11 }
  },
  'C++': {
    code: `void merge(int arr[], int l, int m, int r) {
    // ... merge logic ...
}
void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    highlight: { COMPARE: 2, DIVIDE: 6, MERGE: 8, OVERWRITE: 2 }
  },
  'C#': {
    code: `void MergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        MergeSort(arr, l, m);
        MergeSort(arr, m + 1, r);
        Merge(arr, l, m, r);
    }
}`,
    highlight: { COMPARE: 5, DIVIDE: 2, MERGE: 5, OVERWRITE: 5 }
  },
  'Java': {
    code: `void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    highlight: { COMPARE: 5, DIVIDE: 2, MERGE: 5, OVERWRITE: 5 }
  },
  'Python': {
    code: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        # merge logic here`,
    highlight: { COMPARE: 7, DIVIDE: 2, MERGE: 6, OVERWRITE: 7 }
  },
  'Go': {
    code: `func MergeSort(arr []int) []int {
    if len(arr) < 2 { return arr }
    mid := len(arr) / 2
    return merge(MergeSort(arr[:mid]), MergeSort(arr[mid:]))
}`,
    highlight: { COMPARE: 3, DIVIDE: 2, MERGE: 3, OVERWRITE: 3 }
  }
};