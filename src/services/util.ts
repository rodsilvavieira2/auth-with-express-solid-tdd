type Data = {
  password: string;
};

export function removePasswordFiled<T extends Data>(
  data: T
): Omit<T, "password"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = data;

  return rest;
}
