export const bellmanFordSnippets = {
  javascript: `function bellmanFord(nodes, edges, startNode) {
  let distances = {};
  for (let n of nodes) distances[n] = Infinity;
  distances[startNode] = 0;

  for (let i = 0; i < nodes.length - 1; i++) {
    for (let {u, v, w} of edges) {
      if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
        distances[v] = distances[u] + w;
      }
    }
  }

  // Check negative cycle
  for (let {u, v, w} of edges) {
    if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
      return "Negative Cycle Detected";
    }
  }
  return distances;
}`
};