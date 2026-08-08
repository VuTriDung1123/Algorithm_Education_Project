export const primSnippets = {
  javascript: `function prim(nodes, edges, startNode) {
  let tree = new Set([startNode]);
  let mstEdges = [];
  
  while (tree.size < nodes.length) {
    let minEdge = null;
    for (let {u, v, w} of edges) {
      // Find edge that connects tree with non-tree
      if ((tree.has(u) && !tree.has(v)) || (tree.has(v) && !tree.has(u))) {
        if (!minEdge || w < minEdge.w) {
          minEdge = {u, v, w};
        }
      }
    }
    if (!minEdge) break;
    tree.add(minEdge.u);
    tree.add(minEdge.v);
    mstEdges.push(minEdge);
  }
  return mstEdges;
}`
};