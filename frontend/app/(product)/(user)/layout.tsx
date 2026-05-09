"use client"
import { Spinner } from "@/components/ui/spinner";
import { useJobStatusUpdate } from "@/features/Common/job.status";
import { useProfileDetails } from "@/features/Profile/profile.details";
import { useSocket } from "@/features/Socket/starter";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useSocket();
  const isProfileLoading = useProfileDetails();
  useJobStatusUpdate();
  if (isProfileLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Spinner className="size-8" /> Grabbing user details
      </div>
    );
  return <>{ children }</>;
}
