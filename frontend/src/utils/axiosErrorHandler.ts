import { AxiosError } from 'axios';
// Returns a string with error message. TODO: Improve this, add more errors
export const axiosErrorHandler = (err: AxiosError) => {
  if (err.message === 'Network Error') return err.message;
  else return err.response?.data;
};
