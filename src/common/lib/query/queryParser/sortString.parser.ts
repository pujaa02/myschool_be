export const parseStr = (str: string) => {
  const result: string[] = [];
  let item = '',
    depth = 0;
  const push = () => {
    if (item) {
      result.push(item);
      item = '';
    }
  };
  for (const c of str) {
    if (!depth && c === ',') {
      push();
    } else {
      item += c;
      if (c === '[') {
        depth++;
      }
      if (c === ']') {
        depth--;
      }
    }
  }
  push();
  return result || [];
};
