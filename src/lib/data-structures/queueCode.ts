export const queueSnippets = {
    ENQUEUE: `function enqueue(value):
  if rear == MAX - 1:
    print "Queue Overflow"
    return
  if front == -1:
    front = 0
  rear = rear + 1
  queue[rear] = value`,

    DEQUEUE: `function dequeue():
  if front == -1 or front > rear:
    print "Queue Underflow"
    return null
  value = queue[front]
  front = front + 1
  return value`,
  
    FRONT: `function peekFront():
  if front == -1 or front > rear:
    return null
  return queue[front]`
};
