export const linkedListSnippets = {
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
  head = newNode`,

  INSERT_TAIL: `function insertTail(value):
  newNode = new Node(value)
  if head == null:
    head = newNode
    return
  current = head
  while current.next != null:
    current = current.next
  current.next = newNode`,

  INSERT_INDEX: `function insertAt(index, value):
  if index == 0: return insertHead(value)
  newNode = new Node(value)
  current = head
  // Traverse to (index - 1)
  for i from 0 to index - 2:
    current = current.next
  // Link new node
  newNode.next = current.next
  current.next = newNode`,

  DELETE_HEAD: `function deleteHead():
  if head == null: return
  temp = head
  head = head.next
  delete temp`,

  DELETE_INDEX: `function deleteAt(index):
  if index == 0: return deleteHead()
  current = head
  // Traverse to (index - 1)
  for i from 0 to index - 2:
    current = current.next
  if current.next == null: return
  // Bypass node to delete
  nodeToDelete = current.next
  current.next = nodeToDelete.next
  delete nodeToDelete`
};