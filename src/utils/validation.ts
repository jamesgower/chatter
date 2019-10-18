export const isRealString = (str): boolean => {
  return typeof str === "string" && str.trim().length > 0;
};
