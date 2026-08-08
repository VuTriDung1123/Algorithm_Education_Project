export const topoSortSnippets = {
  javascript: `function topologicalSort(nodes, edges) {
  let inDegree = {};
  for (let n of nodes) inDegree[n] = 0;
  for (let {u, v} of edges) inDegree[v]++;
  
  let queue = nodes.filter(n => inDegree[n] === 0);
  let result = [];
  
  while (queue.length > 0) {
    let curr = queue.shift();
    result.push(curr);
    
    for (let {u, v} of edges) {
      if (u === curr) {
        inDegree[v]--;
        if (inDegree[v] === 0) queue.push(v);
      }
    }
  }
  return result;
}`
};