"use client"
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogOverlay } from "./ui/dialog";


export default function DialogModal({children}: Readonly<{children: React.ReactNode}>) {
    const router = useRouter()
    const handleChange = () => {
        router.back()
    }
    return (
        <Dialog defaultOpen={true} open={true} onOpenChange={handleChange}>
            <DialogOverlay>
                <DialogContent>
                    {children}
                </DialogContent>
            </DialogOverlay>
        </Dialog>
    )
}