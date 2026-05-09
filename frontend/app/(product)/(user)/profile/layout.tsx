"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthLayout({
  children,
  posts,
  savedPosts,
  reels,
  model,
}: Readonly<{
  children: React.ReactNode;
  posts: React.ReactNode;
  savedPosts: React.ReactNode;
  reels: React.ReactNode;
  model: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <main>
        <div className="w-full max-w-4xl mx-auto mb-8">{children}</div>
        <Tabs defaultValue="saved" className="">
          <TabsList className="w-full max-w-4xl mx-auto flex justify-center gap-8 border-t border-border bg-transparent rounded-none h-14 p-0">
            <TabsTrigger
              value="saved"
              className="h-14 rounded-none bg-transparent px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-t-2 border-transparent shadow-none data-[state=active]:text-foreground data-[state=active]:rounded-2xl transition-all"
            >
              Saved Posts
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="h-14 rounded-none bg-transparent px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-t-2 border-transparent shadow-none data-[state=active]:text-foreground data-[state=active]:rounded-2xl transition-all"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="reels"
              className="h-14 rounded-none bg-transparent px-4 py-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground border-t-2 border-transparent shadow-none data-[state=active]:text-foreground data-[state=active]:rounded-2xl transition-all"
            >
              Reels
            </TabsTrigger>
          </TabsList>
          <div className="w-full max-w-4xl mx-auto pt-4">
            <TabsContent value="saved" className="min-w-full">
              {savedPosts}
            </TabsContent>
            <TabsContent value="posts" className="min-w-full">
              {posts}
            </TabsContent>
            <TabsContent value="reels" className="min-w-full">
              {reels}
            </TabsContent>
          </div>
        </Tabs>
      </main>
      <div id="model-slot" className="relative z-50">
        {model}
      </div>
    </div>
  );
}
