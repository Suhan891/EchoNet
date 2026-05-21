"use client";
import { useCancelJob, useJobStatus, useRetryJob } from "@/hooks/useJob";
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
  const retryJobs = jobs.filter((job) => job.status === "RETRY");
  const cancelJobs = jobs.filter((job) => job.status === "CANCELLED");
  const jobIds = jobsInProgress.map((job) => job.id);

  const retry = useRetryJob();
  const cancel = useCancelJob();

  const jobResults = useJobStatus(jobIds);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (retryJobs) {
      retryJobs.forEach((job) => {
        retry.mutate(job.id, {
          onSuccess: (result) => {
            console.log(result);
            updateJobStatus(job.id, "PROGRESS");
            queryClient.invalidateQueries({
              queryKey: [userId, queryKeys.PROFILE],
            });
          },
          onError: (error) => {
            console.error(error.error);
          },
        });
      });

      if (cancelJobs)
        cancelJobs.forEach((job) => {
          cancel.mutate(job.id, {
            onSuccess: (result) => {
              removeJob(job.id);
              console.log(result);
              queryClient.invalidateQueries({
                queryKey: [userId, queryKeys.PROFILE],
              });
            },
            onError: (error) => {
              console.error(error.error);
            },
          });
        });

      jobResults.forEach((result) => {
        const { data: jobData, isSuccess, isError, error } = result;
        if (isSuccess) {
          const job = jobsInProgress.find((job) => job.id === jobData.data.id);
          if (!job) return;

          if (
            jobData.data.status !== "SUCCESS" &&
            jobData.data.status !== "CANCELLED" &&
            jobData.data.status !== job.status
          )
            updateJobStatus(jobData.data.id, jobData.data.status);
          console.log(jobData.data);

          if (
            jobData.data.status === "SUCCESS" ||
            jobData.data.status === "CANCELLED"
          ) {
            removeJob(jobData.data.id);
            queryClient.invalidateQueries({
              queryKey: [userId, queryKeys.PROFILE],
            });
          }
        }
        if (isError) {
          console.error(error.error);
        }
      });
    }
  }, [
    jobResults,
    cancel,
    cancelJobs,
    retry,
    retryJobs,
    updateJobStatus,
    jobsInProgress,
    queryClient,
    userId,
    removeJob,
  ]);
}
