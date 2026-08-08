export const avlSnippets = {
    INSERT: `function insert(node, value):
  if node is null:
    return new Node(value)
  if value < node.value:
    node.left = insert(node.left, value)
  else if value > node.value:
    node.right = insert(node.right, value)
  else:
    return node
    
  node.height = 1 + max(height(node.left), height(node.right))
  balance = getBalance(node)
  
  if balance > 1 and value < node.left.value:
    return rightRotate(node)
  if balance < -1 and value > node.right.value:
    return leftRotate(node)
  if balance > 1 and value > node.left.value:
    node.left = leftRotate(node.left)
    return rightRotate(node)
  if balance < -1 and value < node.right.value:
    node.right = rightRotate(node.right)
    return leftRotate(node)
    
  return node`,

    ROTATE_LEFT: `function leftRotate(x):
  y = x.right
  T2 = y.left
  y.left = x
  x.right = T2
  x.height = max(height(x.left), height(x.right)) + 1
  y.height = max(height(y.left), height(y.right)) + 1
  return y`,
  
    ROTATE_RIGHT: `function rightRotate(y):
  x = y.left
  T2 = x.right
  x.right = y
  y.left = T2
  y.height = max(height(y.left), height(y.right)) + 1
  x.height = max(height(x.left), height(x.right)) + 1
  return x`
};
