"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthLayout({
  children,
  posts,
  savedPosts,
  reels,
}: Readonly<{
  children: React.ReactNode;
  posts: React.ReactNode;
  savedPosts: React.ReactNode;
  reels: React.ReactNode;
}>) {
  return (
    <main className="bg-background">
      <div className="h-[25vw]">{children}</div>
      <Tabs defaultValue="saved" className="w-full " >
          <TabsList className="min-w-fit relative flex justify-center-safe gap-6 mx-[45%]">
            <TabsTrigger value="saved" className=" p-4 ">Saved Posts</TabsTrigger>
            <TabsTrigger value="posts" className="p-4">Posts</TabsTrigger>
            <TabsTrigger value="reels" className="p-4">Reels</TabsTrigger>
          </TabsList>
          <TabsContent value="saved">{savedPosts} </TabsContent>
          <TabsContent value="posts">{posts}</TabsContent>
          <TabsContent value="reels">{reels}</TabsContent>
      </Tabs>
    </main>
  );
}
