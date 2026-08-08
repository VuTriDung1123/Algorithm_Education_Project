export const graphTraversalSnippets = {
    BFS: `function BFS(graph, startNode):
  queue = [startNode]
  visited = {startNode: true}
  
  while queue is not empty:
    node = queue.dequeue()
    print node
    
    for neighbor in graph[node]:
      if not visited[neighbor]:
        visited[neighbor] = true
        queue.enqueue(neighbor)`,

    DFS: `function DFS(graph, startNode):
  stack = [startNode]
  visited = {startNode: true}
  
  while stack is not empty:
    node = stack.pop()
    print node
    
    for neighbor in graph[node]:
      if not visited[neighbor]:
        visited[neighbor] = true
        stack.push(neighbor)`
};
