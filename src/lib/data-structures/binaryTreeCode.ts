export const btSnippets = {
    PRE_ORDER: `function preOrder(node):
  if node is null: return
  print node.value
  preOrder(node.left)
  preOrder(node.right)`,

    IN_ORDER: `function inOrder(node):
  if node is null: return
  inOrder(node.left)
  print node.value
  inOrder(node.right)`,
  
    POST_ORDER: `function postOrder(node):
  if node is null: return
  postOrder(node.left)
  postOrder(node.right)
  print node.value`
};
