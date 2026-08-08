export const dsuSnippets = {
    FIND: `function find(i):
  if parent[i] == i:
    return i
  
  // Path Compression
  parent[i] = find(parent[i])
  return parent[i]`,

    UNION: `function union(i, j):
  rootI = find(i)
  rootJ = find(j)
  
  if rootI != rootJ:
    // Union by rank (simplified: just make rootI parent of rootJ)
    parent[rootJ] = rootI`
};
