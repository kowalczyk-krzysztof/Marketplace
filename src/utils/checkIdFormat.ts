// Checking if id is valid MongoDB objectId
export const checkIdFormat = (id: string): boolean => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) return false;
  return true;
};
