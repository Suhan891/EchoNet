import { GetJobStatus } from "@/service/jobs";
import { ErrorResponse, JobStatus, SuccessResponse } from "@/types/common";
import { queryKeys } from "@/utils/query.key";
import { useQueries, UseQueryOptions } from "@tanstack/react-query";

export function useJobStatus(jobIds: string[]) {
  return useQueries({
    queries: jobIds.map<UseQueryOptions<SuccessResponse<JobStatus>, ErrorResponse>>((jobId) => ({
      queryKey: [queryKeys.JOBS, jobId],
      queryFn: () => GetJobStatus(jobId),
      enabled: !!jobId,
      refetchInterval: (query) => {
        if (query.state.data?.data.status === "PROGRESS") return 2000;
        return false;
      },
    })),
  });
}
