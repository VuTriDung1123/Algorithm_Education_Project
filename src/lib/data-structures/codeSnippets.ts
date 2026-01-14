// src/lib/data-structures/codeSnippets.ts

export const arrayCodeSnippets = {
  // --- UNSORTED ARRAY ---
  SEARCH_LINEAR: `function linearSearch(value):
  for i from 0 to size - 1:
    if A[i] == value:
      return i // Found
  return -1 // Not found`,

  INSERT_TAIL: `function insertTail(value):
  if size == capacity: return error
  A[size] = value
  size = size + 1`,

  INSERT_HEAD: `function insertHead(value):
  if size == capacity: return error
  for i from size down to 1:
    A[i] = A[i-1] // Shift Right
  A[0] = value
  size = size + 1`,

  INSERT_INDEX: `function insertAt(index, value):
  if size == capacity: return error
  for i from size down to index + 1:
    A[i] = A[i-1] // Shift Right
  A[index] = value
  size = size + 1`,

  DELETE_INDEX: `function removeAt(index):
  if index < 0 or index >= size: return error
  // Shift Left
  for i from index to size - 2:
    A[i] = A[i+1]
  size = size - 1`,

  DELETE_TAIL: `function removeTail():
  if size == 0: return error
  size = size - 1`,

  UPDATE: `function update(index, value):
  if index < 0 or index >= size: return error
  A[index] = value`,

  // --- SORTED ARRAY ---
  SEARCH_BINARY: `function binarySearch(value):
  low = 0, high = size - 1
  while low <= high:
    mid = (low + high) / 2
    if A[mid] == value: return mid
    if A[mid] < value: low = mid + 1
    else: high = mid - 1
  return -1`,

  INSERT_SORTED: `function insertSorted(value):
  if size == capacity: return error
  i = size - 1
  while i >= 0 and A[i] > value:
    A[i+1] = A[i] // Shift Right
    i = i - 1
  A[i+1] = value
  size = size + 1`,

  // --- RANGE QUERY ---
  RANGE_QUERY: `function rangeSum(L, R):
  // Using Prefix Sum Array P
  if L == 0:
    return P[R]
  else:
    return P[R] - P[L-1]`
};


export const dynamicArrayCodeSnippets = {
  PUSH_BACK: `function pushBack(value):
  // 1. Check Capacity
  if size == capacity:
    resize(capacity * 2) // O(N) cost
  
  // 2. Insert at end (O(1))
  A[size] = value
  size = size + 1`,

  RESIZE: `function resize(newCapacity):
  // 1. Create new larger array
  newArray = createArray(newCapacity)
  
  // 2. Copy elements
  for i from 0 to size - 1:
    newArray[i] = A[i]
    
  // 3. Switch reference
  A = newArray
  capacity = newCapacity`,

  INSERT_AT: `function insertAt(index, value):
  if size == capacity:
    resize(capacity * 2)
  
  // Shift Right
  for i from size down to index + 1:
    A[i] = A[i-1]
    
  A[index] = value
  size = size + 1`,

  POP_BACK: `function popBack():
  if size == 0: return error
  // Clear value (optional)
  A[size-1] = null 
  size = size - 1
  
  // Optional: Shrink if too empty
  if size <= capacity / 4:
    resize(capacity / 2)`
};