'use client';

import { useEffect, useState } from 'react';
import { Loader2, ServerCrash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';
import { getUrl } from '@/service/common/requests';

export default function BackendWakeUpProvider({ children }: { children: React.ReactNode }) {
  const [isAwake, setIsAwake] = useState(false);
  const [progress, setProgress] = useState(10);
  const [hasError, setHasError] = useState(false);
  const [statusText, setStatusText] = useState('Connecting to application backend...');

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    // Simulate a smooth progress bar crawl while waking up
    if (!isAwake && !hasError) {
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev; // Hold at 90% until server actually resolves
          return prev + 2;
        });
      }, 600);
    }

    const wakeBackend = async () => {
      try {
        const res = await fetch(`${getUrl()}/health`);
        if (res.ok) {
          setProgress(100);
          // Small delay so user sees 100% complete before transition
          setTimeout(() => setIsAwake(true), 400); 
          toast.success('Server is alive')
        } else {
          throw new Error('Server returned unhealthy status');
        }
      } catch (error) {
        setStatusText('Backend is waking up from sleep mode, please stand by (takes ~30s)...');
        setTimeout(wakeBackend, 5000); // Retry polling every 5 seconds
        toast.error('Server has crashed')
        console.error(error);
      }
    };

    wakeBackend();

    return () => clearInterval(progressInterval);
  }, [isAwake, hasError]);

  if (!isAwake) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg border-muted/60 animate-in fade-in zoom-in-95 duration-300">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Initializing System
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground min-h-[40px] px-2">
              {statusText}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* shadcn Progress component */}
            <Progress value={progress} className="h-2 w-full transition-all duration-500 ease-out" />
            
            <p className="text-center text-xs text-muted-foreground/70 font-medium">
              {progress < 100 ? `Booting ecosystem resources... ${progress}%` : 'Connected successfully!'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
