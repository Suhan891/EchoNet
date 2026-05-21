import { CancelJob, GetJobStatus, RetryJob } from "@/service/jobs";
import { ErrorResponse, JobStatus, SuccessResponse } from "@/types/common";
import { queryKeys } from "@/utils/query.key";
import {
  useMutation,
  useQueries,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useJobStatus(jobIds: string[]) {
  return useQueries({
    queries: jobIds.map<
      UseQueryOptions<SuccessResponse<JobStatus>, ErrorResponse>
    >((jobId) => ({
      queryKey: [queryKeys.JOBS, jobId],
      queryFn: () => GetJobStatus(jobId),
      enabled: !!jobId,
      refetchInterval: (query) => {
        if (query.state.data?.data.status === "PROGRESS") return 3000;
        return false;
      },
    })),
  });
}

export function useRetryJob() {
  return useMutation<SuccessResponse<JobStatus>, ErrorResponse, string>({
    mutationFn: (payload) => RetryJob(payload),
  });
}

export function useCancelJob() {
  return useMutation<SuccessResponse<null>, ErrorResponse, string>({
    mutationFn: (payload) => CancelJob(payload),
  });
}
