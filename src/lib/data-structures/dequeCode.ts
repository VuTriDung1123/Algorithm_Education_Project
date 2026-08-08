export const dequeSnippets = {
    INSERT_FRONT: `function insertFront(value):
  if isFull():
    print "Deque Overflow"
    return
  if front == -1:
    front = 0
    rear = 0
  else if front == 0:
    front = MAX - 1
  else:
    front = front - 1
  deque[front] = value`,

    INSERT_REAR: `function insertRear(value):
  if isFull():
    print "Deque Overflow"
    return
  if front == -1:
    front = 0
    rear = 0
  else if rear == MAX - 1:
    rear = 0
  else:
    rear = rear + 1
  deque[rear] = value`,

    DELETE_FRONT: `function deleteFront():
  if isEmpty():
    print "Deque Underflow"
    return null
  value = deque[front]
  if front == rear:
    front = -1
    rear = -1
  else if front == MAX - 1:
    front = 0
  else:
    front = front + 1
  return value`,
  
    DELETE_REAR: `function deleteRear():
  if isEmpty():
    print "Deque Underflow"
    return null
  value = deque[rear]
  if front == rear:
    front = -1
    rear = -1
  else if rear == 0:
    rear = MAX - 1
  else:
    rear = rear - 1
  return value`
};
