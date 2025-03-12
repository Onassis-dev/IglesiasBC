export const res = <T, L extends number>(status: L, body: T) => {
  return {
    status,
    body,
  };
};

export const error = (message: string, status: 400 | 404 | 500) => {
  return {
    status,
    body: { message },
  };
};
