export const doublyLinkedListSnippets = {
  SEARCH: `function search(value):
  current = head
  index = 0
  while current != null:
    if current.data == value:
      return index
    current = current.next
    index++
  return -1`,

  INSERT_HEAD: `function insertHead(value):
  newNode = new Node(value)
  newNode.next = head
  if head != null:
    head.prev = newNode
  head = newNode`,

  INSERT_TAIL: `function insertTail(value):
  newNode = new Node(value)
  if head == null:
    head = newNode
    return
  current = head
  while current.next != null:
    current = current.next
  current.next = newNode
  newNode.prev = current`,

  INSERT_INDEX: `function insertAt(index, value):
  if index == 0: return insertHead(value)
  newNode = new Node(value)
  current = head
  for i from 0 to index - 2:
    current = current.next
  // Wire up newNode
  newNode.next = current.next
  newNode.prev = current
  if current.next != null:
    current.next.prev = newNode
  current.next = newNode`,

  DELETE_HEAD: `function deleteHead():
  if head == null: return
  temp = head
  head = head.next
  if head != null:
    head.prev = null
  delete temp`,

  DELETE_TAIL: `function deleteTail():
  if head == null: return
  current = head
  while current.next != null:
    current = current.next
  if current.prev != null:
    current.prev.next = null
  else:
    head = null
  delete current`,

  DELETE_INDEX: `function deleteAt(index):
  if index == 0: return deleteHead()
  current = head
  for i from 0 to index - 1:
    current = current.next
  // Bypass current
  current.prev.next = current.next
  if current.next != null:
    current.next.prev = current.prev
  delete current`
};