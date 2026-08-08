export const bloomFilterSnippets = {
    INSERT: `function insert(key, value):
  index = key % MAX
  original_index = index
  while table[index] is not empty and table[index].key != key:
    index = (index + 1) % MAX
    if index == original_index:
      print "Hash Table Full"
      return
  table[index] = (key, value)`,

    SEARCH: `function search(key):
  index = key % MAX
  original_index = index
  while table[index] is not empty:
    if table[index].key == key:
      return table[index].value
    index = (index + 1) % MAX
    if index == original_index:
      break
  return null`,
  
    DELETE: `function delete(key):
  index = key % MAX
  original_index = index
  while table[index] is not empty:
    if table[index].key == key:
      table[index].state = DELETED
      return true
    index = (index + 1) % MAX
    if index == original_index:
      break
  return false`
};
