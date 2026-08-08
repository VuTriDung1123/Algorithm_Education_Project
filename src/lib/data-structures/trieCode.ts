export const trieSnippets = {
    INSERT: `function insert(word):
  node = root
  for char in word:
    if char not in node.children:
      node.children[char] = new Node()
    node = node.children[char]
  node.isEndOfWord = true`,

    SEARCH: `function search(word):
  node = root
  for char in word:
    if char not in node.children:
      return false
    node = node.children[char]
  return node.isEndOfWord`
};
