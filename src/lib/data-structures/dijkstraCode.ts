export const dijkstraSnippets = {
    DIJKSTRA: `function Dijkstra(graph, startNode):
  distances = { node: Infinity for node in graph }
  distances[startNode] = 0
  pq = PriorityQueue()
  pq.enqueue(startNode, 0)
  
  while !pq.isEmpty():
    current, currentDist = pq.dequeue()
    
    if currentDist > distances[current]:
      continue
      
    for neighbor, weight in graph[current]:
      distance = currentDist + weight
      
      if distance < distances[neighbor]:
        distances[neighbor] = distance
        pq.enqueue(neighbor, distance)`
};
