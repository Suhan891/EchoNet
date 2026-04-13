"use client";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "./ui/dialog";

export default function DialogModal({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const handleChange = (isOpen: boolean) => {
    if (!isOpen) router.back();
  };
  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleChange}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
