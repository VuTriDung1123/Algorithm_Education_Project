export const bstSnippets = {
    INSERT: `function insert(root, value):
  if root is null:
    return new Node(value)
  if value < root.value:
    root.left = insert(root.left, value)
  else if value > root.value:
    root.right = insert(root.right, value)
  return root`,

    SEARCH: `function search(root, value):
  if root is null or root.value == value:
    return root
  if root.value < value:
    return search(root.right, value)
  return search(root.left, value)`,
  
    DELETE: `function delete(root, value):
  if root is null: return null
  if value < root.value:
    root.left = delete(root.left, value)
  else if value > root.value:
    root.right = delete(root.right, value)
  else:
    if root.left is null: return root.right
    if root.right is null: return root.left
    minNode = findMin(root.right)
    root.value = minNode.value
    root.right = delete(root.right, minNode.value)
  return root`
};
