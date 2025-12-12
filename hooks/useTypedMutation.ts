import useSWRMutation, { SWRMutationConfiguration } from "swr/mutation";
import { AxiosError } from "axios";

export function useTypedMutation<
  TData = unknown,
  TArg = unknown,
  TError = AxiosError
>(
  key: string,
  fetcher: (url: string, arg: { arg: TArg }) => Promise<TData>,
  options?: SWRMutationConfiguration<TData, TError, string, TArg>
) {
  return useSWRMutation<TData, TError, string, TArg>(key, fetcher, options);
}
