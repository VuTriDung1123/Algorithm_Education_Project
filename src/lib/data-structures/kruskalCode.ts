export const kruskalSnippets = {
    KRUSKAL: `function Kruskal(graph):
  edges = sort(graph.edges, by=weight)
  mst = []
  dsu = new DSU(graph.nodes)
  
  for edge in edges:
    u = edge.source
    v = edge.target
    
    if dsu.find(u) != dsu.find(v):
      dsu.union(u, v)
      mst.push(edge)
      
    if mst.length == graph.nodes.length - 1:
      break
      
  return mst`
};
