/**
 * @param {Object} props
 * @description 针对搜索值做统一处理
 */
export function convertParams(props) {
  const newParams = {};
  for (const index in props) {
    const item = props[index];
    const type = typeof item;
    if (item || item === false || item === 0) {
      if (item && type === 'string') {
        newParams[index] = item.trim();
      } else {
        newParams[index] = item;
      }
    }
  }
  return newParams;
};
