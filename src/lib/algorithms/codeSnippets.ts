export type Language = 'Pseudo' | 'C++' | 'C#' | 'Java' | 'Python' | 'Go';

interface CodeSnippet {
  code: string;
  highlight: {
    COMPARE?: number;
    SWAP?: number;   // Dấu ? nghĩa là có thể không có (Insertion Sort ít dùng Swap)
    SHIFT?: number;  // Dành cho Insertion Sort
    INSERT?: number; // Dành cho Insertion Sort
    DIVIDE?: number;     // <--- MỚI: Cho Merge Sort
    MERGE?: number;      // <--- MỚI: Cho Merge Sort
    OVERWRITE?: number;  // <--- MỚI: Cho Merge Sort
    PIVOT?: number;      // <--- MỚI: Cho Quick Sort
    COUNT?: number;        // <--- MỚI: Cho Counting Sort
    ACCUMULATE?: number;   // <--- MỚI: Cho Counting Sort
    PLACE?: number;        // <--- MỚI: Cho Counting Sort
    GET_DIGIT?: number;    // <--- MỚI: Cho Radix Sort
    BUCKET_PUSH?: number;  // <--- MỚI: Cho Radix Sort
    BUCKET_POP?: number;   // <--- MỚI: Cho Radix Sort
    BUCKET_SCATTER?: number;      // Cho Bucket Sort
    BUCKET_SORT_INTERNAL?: number; // Cho Bucket Sort
    BUCKET_GATHER?: number;      // Cho Bucket Sort
    TIM_RUN_START?: number;  // Cho Tim Sort
    TIM_MERGE_START?: number; // Cho Tim Sort
    

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


// --- 5. QUICK SORT ---
export const quickSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure quickSort(arr, low, high):
  if low < high:
    pi = partition(arr, low, high)
    quickSort(arr, low, pi - 1)
    quickSort(arr, pi + 1, high)
  end if
end procedure

procedure partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j = low to high - 1:
    if arr[j] < pivot:
      i++
      swap arr[i] with arr[j]
  swap arr[i + 1] with arr[high]
  return i + 1`,
    highlight: { COMPARE: 12, SWAP: 14, PIVOT: 10 }
  },
  'C++': {
    code: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    highlight: { COMPARE: 5, SWAP: 7, PIVOT: 2 }
  },
  'C#': {
    code: `int Partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            // swap arr[i] and arr[j]
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    // swap arr[i+1] and arr[high]
    int t = arr[i+1]; arr[i+1] = arr[high]; arr[high] = t;
    return i + 1;
}
void QuickSort(int[] arr, int low, int high) { ... }`,
    highlight: { COMPARE: 5, SWAP: 8, PIVOT: 2 }
  },
  'Java': {
    code: `int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = temp;
    return i + 1;
}`,
    highlight: { COMPARE: 5, SWAP: 7, PIVOT: 2 }
  },
  'Python': {
    code: `def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i = i + 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)`,
    highlight: { COMPARE: 5, SWAP: 7, PIVOT: 2 }
  },
  'Go': {
    code: `func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low - 1
    for j := low; j < high; j++ {
        if arr[j] < pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
}`,
    highlight: { COMPARE: 5, SWAP: 7, PIVOT: 2 }
  }
};


// --- 6. HEAP SORT ---
export const heapSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure heapSort(arr):
  n = length(arr)
  // Build max heap
  for i = n/2 - 1 down to 0:
    heapify(arr, n, i)
  // Extract elements
  for i = n - 1 down to 0:
    swap arr[0] with arr[i]
    heapify(arr, i, 0)
end procedure

procedure heapify(arr, n, i):
  largest = i
  l = 2*i + 1
  r = 2*i + 2
  if l < n and arr[l] > arr[largest]: largest = l
  if r < n and arr[r] > arr[largest]: largest = r
  if largest != i:
    swap arr[i] with arr[largest]
    heapify(arr, n, largest)`,
    highlight: { COMPARE: 19, SWAP: 22 } // Highlight dòng so sánh và swap trong heapify
  },
  'C++': {
    code: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}
void heapSort(int arr[], int n) {
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
    highlight: { COMPARE: 5, SWAP: 8 }
  },
  'C#': {
    code: `void Heapify(int[] arr, int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
        Heapify(arr, n, largest);
    }
}
void HeapSort(int[] arr) { ... }`,
    highlight: { COMPARE: 5, SWAP: 8 }
  },
  'Java': {
    code: `void heapify(int arr[], int n, int i) {
    int largest = i;
    int l = 2 * i + 1;
    int r = 2 * i + 2;
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest != i) {
        int swap = arr[i]; arr[i] = arr[largest]; arr[largest] = swap;
        heapify(arr, n, largest);
    }
}`,
    highlight: { COMPARE: 5, SWAP: 8 }
  },
  'Python': {
    code: `def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
    highlight: { COMPARE: 5, SWAP: 8 }
  },
  'Go': {
    code: `func heapify(arr []int, n int, i int) {
    largest := i
    l := 2*i + 1
    r := 2*i + 2
    if l < n && arr[l] > arr[largest] { largest = l }
    if r < n && arr[r] > arr[largest] { largest = r }
    if largest != i {
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)
    }
}`,
    highlight: { COMPARE: 5, SWAP: 8 }
  }
};


// --- 7. COUNTING SORT ---
export const countingSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure countingSort(arr):
  max = findMax(arr)
  count = array of size max+1 filled with 0
  
  // Phase 1: Count
  for val in arr:
    count[val]++
    
  // Phase 2: Accumulate
  for i = 1 to max:
    count[i] += count[i-1]
    
  // Phase 3: Place
  output = array of size length(arr)
  for i = length(arr)-1 down to 0:
    val = arr[i]
    pos = count[val] - 1
    output[pos] = val
    count[val]--`,
    highlight: { COUNT: 7, ACCUMULATE: 11, PLACE: 17 } // Các dòng tương ứng
  },
  'C++': {
    code: `void countingSort(vector<int>& arr) {
    int max = *max_element(arr.begin(), arr.end());
    vector<int> count(max + 1, 0);
    vector<int> output(arr.size());

    for (int x : arr) count[x]++;

    for (int i = 1; i <= max; i++) 
        count[i] += count[i - 1];

    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
}`,
    highlight: { COUNT: 5, ACCUMULATE: 8, PLACE: 11 }
  },
  'C#': {
    code: `void CountingSort(int[] arr) {
    int max = arr.Max();
    int[] count = new int[max + 1];
    int[] output = new int[arr.Length];

    foreach (int x in arr) count[x]++;

    for (int i = 1; i <= max; i++)
        count[i] += count[i - 1];

    for (int i = arr.Length - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
}`,
    highlight: { COUNT: 5, ACCUMULATE: 8, PLACE: 11 }
  },
  'Java': {
    code: `void countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int[] count = new int[max + 1];
    int[] output = new int[arr.length];

    for (int x : arr) count[x]++;

    for (int i = 1; i <= max; i++)
        count[i] += count[i - 1];

    for (int i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }
}`,
    highlight: { COUNT: 5, ACCUMULATE: 8, PLACE: 11 }
  },
  'Python': {
    code: `def counting_sort(arr):
    max_val = max(arr)
    count = [0] * (max_val + 1)
    output = [0] * len(arr)

    for x in arr: count[x] += 1

    for i in range(1, len(count)):
        count[i] += count[i-1]

    for i in range(len(arr)-1, -1, -1):
        output[count[arr[i]] - 1] = arr[i]
        count[arr[i]] -= 1`,
    highlight: { COUNT: 5, ACCUMULATE: 8, PLACE: 11 }
  },
  'Go': {
    code: `func CountingSort(arr []int) {
    // ... find max ...
    count := make([]int, max+1)
    output := make([]int, len(arr))

    for _, x := range arr { count[x]++ }

    for i := 1; i <= max; i++ { count[i] += count[i-1] }

    for i := len(arr) - 1; i >= 0; i-- {
        output[count[arr[i]]-1] = arr[i]
        count[arr[i]]--
    }
}`,
    highlight: { COUNT: 5, ACCUMULATE: 7, PLACE: 10 }
  }
};

// --- 8. RADIX SORT ---
export const radixSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure radixSort(arr):
  max = getMax(arr)
  for exp = 1 to max/exp > 0:
    buckets = create 10 empty lists
    
    // Scatter
    for val in arr:
      digit = (val / exp) % 10
      buckets[digit].push(val)
      
    // Gather
    index = 0
    for i = 0 to 9:
      while buckets[i] is not empty:
        arr[index++] = buckets[i].pop()
    
    exp = exp * 10
end procedure`,
    highlight: { GET_DIGIT: 8, BUCKET_PUSH: 9, BUCKET_POP: 15 } // Các dòng tương ứng
  },
  'C++': {
    code: `void countSort(int arr[], int n, int exp) {
    // ... Counting sort logic based on digit ...
    // This snippet simplifies the concept using Buckets
}
void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}`,
    highlight: { GET_DIGIT: 6, BUCKET_PUSH: 7, BUCKET_POP: 7 }
  },
  'C#': {
    code: `void RadixSort(int[] arr) {
    int max = arr.Max();
    for (int exp = 1; max / exp > 0; exp *= 10) {
        // Scatter to buckets based on digit
        // Gather back to array
    }
}`,
    highlight: { GET_DIGIT: 3, BUCKET_PUSH: 4, BUCKET_POP: 5 }
  },
  'Java': {
    code: `void radixSort(int arr[], int n) {
    int m = getMax(arr, n);
    for (int exp = 1; m / exp > 0; exp *= 10)
        countSort(arr, n, exp);
}`,
    highlight: { GET_DIGIT: 3, BUCKET_PUSH: 4, BUCKET_POP: 4 }
  },
  'Python': {
    code: `def radix_sort(arr):
    max1 = max(arr)
    exp = 1
    while max1 / exp > 0:
        counting_sort(arr, exp)
        exp *= 10`,
    highlight: { GET_DIGIT: 4, BUCKET_PUSH: 5, BUCKET_POP: 5 }
  },
  'Go': {
    code: `func RadixSort(arr []int) {
    m := getMax(arr)
    for exp := 1; m/exp > 0; exp *= 10 {
        countSort(arr, exp)
    }
}`,
    highlight: { GET_DIGIT: 3, BUCKET_PUSH: 4, BUCKET_POP: 4 }
  }
};


// --- 9. BUCKET SORT ---
export const bucketSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure bucketSort(arr):
  create buckets array
  
  // Scatter
  for each element in arr:
    index = bucketIndex(element)
    buckets[index].push(element)
    
  // Sort Internal & Gather
  i = 0
  for each bucket in buckets:
    sort(bucket) // usually Insertion Sort
    for each element in bucket:
      arr[i++] = element
end procedure`,
    highlight: { BUCKET_SCATTER: 6, BUCKET_SORT_INTERNAL: 11, BUCKET_GATHER: 13 }
  },
  'C++': {
    code: `void bucketSort(float arr[], int n) {
    vector<float> b[n];
    
    // 1. Put array elements in different buckets
    for (int i=0; i<n; i++) {
       int bi = n * arr[i]; 
       b[bi].push_back(arr[i]);
    }
 
    // 2. Sort individual buckets & Concatenate
    int index = 0;
    for (int i=0; i<n; i++) {
       sort(b[i].begin(), b[i].end());
       for (int j=0; j<b[i].size(); j++)
          arr[index++] = b[i][j];
    }
}`,
    highlight: { BUCKET_SCATTER: 6, BUCKET_SORT_INTERNAL: 11, BUCKET_GATHER: 13 }
  },
  'C#': {
    code: `void BucketSort(int[] arr) {
    // Init buckets...
    
    // Scatter
    for (int i = 0; i < arr.Length; i++) {
        int bucketIdx = GetBucketIndex(arr[i]);
        buckets[bucketIdx].Add(arr[i]);
    }

    // Sort & Gather
    int k = 0;
    foreach (var bucket in buckets) {
        bucket.Sort();
        foreach (var item in bucket) arr[k++] = item;
    }
}`,
    highlight: { BUCKET_SCATTER: 6, BUCKET_SORT_INTERNAL: 11, BUCKET_GATHER: 12 }
  },
  'Java': {
    code: `void bucketSort(float[] arr, int n) {
    ArrayList<Float>[] buckets = new ArrayList[n];
    // Init...
    
    for (int i = 0; i < n; i++) {
        int bi = (int)(n * arr[i]);
        buckets[bi].add(arr[i]);
    }

    int index = 0;
    for (int i = 0; i < n; i++) {
        Collections.sort(buckets[i]);
        for (int j = 0; j < buckets[i].size(); j++) {
            arr[index++] = buckets[i].get(j);
        }
    }
}`,
    highlight: { BUCKET_SCATTER: 7, BUCKET_SORT_INTERNAL: 12, BUCKET_GATHER: 14 }
  },
  'Python': {
    code: `def bucket_sort(arr):
    buckets = [[] for _ in range(len(arr))]
    
    # Scatter
    for num in arr:
        bi = int(len(arr) * num)
        buckets[bi].append(num)
        
    # Sort & Gather
    res = []
    for bucket in buckets:
        bucket.sort()
        res.extend(bucket)
    return res`,
    highlight: { BUCKET_SCATTER: 6, BUCKET_SORT_INTERNAL: 11, BUCKET_GATHER: 12 }
  },
  'Go': {
    code: `func BucketSort(arr []float64) {
    // ... init buckets ...
    for _, v := range arr {
        bi := int(v * float64(n))
        buckets[bi] = append(buckets[bi], v)
    }
    
    idx := 0
    for _, bucket := range buckets {
        sort.Float64s(bucket)
        for _, v := range bucket {
            arr[idx] = v
            idx++
        }
    }
}`,
    highlight: { BUCKET_SCATTER: 4, BUCKET_SORT_INTERNAL: 9, BUCKET_GATHER: 11 }
  }
};

// --- 10. TIM SORT ---
export const timSortCode: Record<Language, CodeSnippet> = {
  'Pseudo': {
    code: `procedure timSort(arr):
  minRun = 32
  n = length(arr)
  
  // 1. Sort individual subarrays of size minRun
  for i = 0 to n by minRun:
    insertionSort(arr, i, min(i + minRun - 1, n - 1))
    
  // 2. Merge subarrays
  size = minRun
  while size < n:
    for left = 0 to n by 2*size:
      mid = left + size - 1
      right = min(left + 2*size - 1, n - 1)
      if mid < right:
        merge(arr, left, mid, right)
    size = 2 * size
end procedure`,
    highlight: { COMPARE: 6, SHIFT: 6, INSERT: 6, MERGE: 14, OVERWRITE: 14 } // Map tạm vào các dòng chính
  },
  'C++': {
    code: `void timSort(int arr[], int n) {
    const int RUN = 32;
    for (int i = 0; i < n; i += RUN)
        insertionSort(arr, i, min((i + RUN - 1), (n - 1)));
 
    for (int size = RUN; size < n; size = 2 * size) {
        for (int left = 0; left < n; left += 2 * size) {
            int mid = left + size - 1;
            int right = min((left + 2 * size - 1), (n - 1));
            if (mid < right)
                merge(arr, left, mid, right);
        }
    }
}`,
    highlight: { COMPARE: 3, SHIFT: 3, MERGE: 10, OVERWRITE: 10 }
  },
  'C#': {
    code: `void TimSort(int[] arr, int n) {
    int RUN = 32;
    for (int i = 0; i < n; i += RUN)
        InsertionSort(arr, i, Math.Min((i + RUN - 1), (n - 1)));
 
    for (int size = RUN; size < n; size = 2 * size) {
        for (int left = 0; left < n; left += 2 * size) {
            int mid = left + size - 1;
            int right = Math.Min((left + 2 * size - 1), (n - 1));
            if (mid < right)
                Merge(arr, left, mid, right);
        }
    }
}`,
    highlight: { COMPARE: 3, SHIFT: 3, MERGE: 10, OVERWRITE: 10 }
  },
  'Java': {
    code: `void timSort(int[] arr, int n) {
    int RUN = 32;
    for (int i = 0; i < n; i += RUN)
        insertionSort(arr, i, Math.min((i + 31), (n - 1)));
 
    for (int size = RUN; size < n; size = 2 * size) {
        for (int left = 0; left < n; left += 2 * size) {
            int mid = left + size - 1;
            int right = Math.min((left + 2 * size - 1), (n - 1));
            if (mid < right)
                merge(arr, left, mid, right);
        }
    }
}`,
    highlight: { COMPARE: 3, SHIFT: 3, MERGE: 10, OVERWRITE: 10 }
  },
  'Python': {
    code: `def tim_sort(arr):
    min_run = 32
    n = len(arr)
    
    for i in range(0, n, min_run):
        insertion_sort(arr, i, min((i + min_run - 1), n - 1))
        
    size = min_run
    while size < n:
        for left in range(0, n, 2 * size):
            mid = left + size - 1
            right = min((left + 2 * size - 1), (n - 1))
            if mid < right:
                merge(arr, left, mid, right)
        size = 2 * size`,
    highlight: { COMPARE: 5, SHIFT: 5, MERGE: 13, OVERWRITE: 13 }
  },
  'Go': {
    code: `func TimSort(arr []int) {
    minRun := 32
    n := len(arr)
    for i := 0; i < n; i += minRun {
        insertionSort(arr, i, min(i+minRun-1, n-1))
    }
    for size := minRun; size < n; size = 2 * size {
        for left := 0; left < n; left += 2 * size {
            mid := left + size - 1
            right := min(left + 2*size-1, n-1)
            if mid < right {
                merge(arr, left, mid, right)
            }
        }
    }
}`,
    highlight: { COMPARE: 4, SHIFT: 4, MERGE: 11, OVERWRITE: 11 }
  }
};