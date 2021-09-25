declare module '*.css' {
  const content: string;
  // eslint-disable-next-line
  export default content;
}

// eslint-disable-next-line
declare function GM_addStyle(string);
