

export function useMyself() {
  return useQuery<SuccessResponse, ErrorResponse>({
    queryKey: ["user"],
    queryFn: () => GetUser(),
    staleTime: 1000* 60* 5
  });
}