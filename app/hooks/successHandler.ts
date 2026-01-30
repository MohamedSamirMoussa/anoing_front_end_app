export const successHandler = (res: any) => {
  if (res.meta.requestStatus === "fulfilled") {
    return res.payload.message;
  }
  return "Operation was successful.";
};
