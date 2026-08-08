export const stackSnippets = {
    PUSH: `function push(value):
  if top == MAX - 1:
    print "Stack Overflow"
    return
  top = top + 1
  stack[top] = value`,

    POP: `function pop():
  if top == -1:
    print "Stack Underflow"
    return null
  value = stack[top]
  top = top - 1
  return value`,
  
    PEEK: `function peek():
  if top == -1:
    return null
  return stack[top]`
};
