export const heapSnippets = {
    INSERT: `function insert(value):
  if size == capacity:
    return "Heap Full"
  heap[size] = value
  size = size + 1
  heapifyUp(size - 1)`,

    HEAPIFY_UP: `function heapifyUp(index):
  parent = (index - 1) / 2
  while index > 0 and heap[parent] > heap[index]:
    swap(heap[parent], heap[index])
    index = parent
    parent = (index - 1) / 2`,

    EXTRACT_MIN: `function extractMin():
  if size == 0:
    return null
  min = heap[0]
  heap[0] = heap[size - 1]
  size = size - 1
  heapifyDown(0)
  return min`,
  
    HEAPIFY_DOWN: `function heapifyDown(index):
  while true:
    smallest = index
    left = 2 * index + 1
    right = 2 * index + 2
    if left < size and heap[left] < heap[smallest]:
      smallest = left
    if right < size and heap[right] < heap[smallest]:
      smallest = right
    if smallest == index:
      break
    swap(heap[index], heap[smallest])
    index = smallest`
};
