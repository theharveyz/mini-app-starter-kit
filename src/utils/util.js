//去除 'pages/' 关键字
const PAGES = 'pages/';
const DIRECTORY_SEPARATOR = '/';

// 动态计算要跳转页面相对于源页面的URL
export const getRedirectUrl = (srcPage, destPage) => {
  let src = srcPage;
  let dest = destPage;
  if (src.indexOf(PAGES) === 0) {
    src = src.substr(PAGES.length);
  }
  // 去除/
  if (src.indexOf(DIRECTORY_SEPARATOR) === 0) {
    src = src.substr(DIRECTORY_SEPARATOR.length);
  }
  // 去除/
  if (dest.indexOf(DIRECTORY_SEPARATOR) === 0) {
    dest = dest.substr(DIRECTORY_SEPARATOR.length);
  }
  // /的数目
  const match = src.match(/\//g);
  if (!match) {
    return dest;
  }
  for (let i = 0; i < match.length; i++) {
    dest = `../${dest}`;
  }
  return dest;
}

