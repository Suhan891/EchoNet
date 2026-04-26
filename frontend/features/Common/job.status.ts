"use client";
import { useJobStatus } from "@/hooks/useJob";
import { useUserStore } from "@/stores/UserStore";
import { queryKeys } from "@/utils/query.key";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useJobStatusUpdate() {
  const jobs = useUserStore((state) => state.jobs);
  const userId = useUserStore((state) => state.userId);
  const updateJobStatus = useUserStore((state) => state.updateJobStatus);
  const removeJob = useUserStore((state) => state.removeJob);
  const jobsInProgress = jobs.filter((job) => job.status === "PROGRESS");
  const jobIds = jobsInProgress.map((job) => job.id);

  const jobResults = useJobStatus(jobIds);
  const queryClient = useQueryClient();
  useEffect(() => {
    jobResults.forEach((result) => {
      const { data: jobData, isSuccess, isError, error } = result;
      if (isSuccess) {
        const job = jobsInProgress.find((job) => job.id === jobData.data.id);
        if (!job) return;

        if (
          jobData.data.status !== "SUCCESS" &&
          jobData.data.status !== job.status
        )
          updateJobStatus(jobData.data.id, jobData.data.status);
        console.log(jobData.data);

        if (jobData.data.status === "SUCCESS") {
          removeJob(jobData.data.id);
          queryClient.invalidateQueries({
            queryKey: [queryKeys.PROFILE, userId],
          });
        }
      }
      if (isError) {
        console.error(error.error);
      }
    });
  }, [
    jobResults,
    updateJobStatus,
    jobsInProgress,
    queryClient,
    userId,
    removeJob,
  ]);
}
