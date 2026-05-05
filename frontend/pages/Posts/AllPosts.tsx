"use client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ItemGroup } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToggleLike } from "@/hooks/useLike";
import { useAllPosts } from "@/hooks/usePost";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/stores/ProfileStore";
import { queryKeys } from "@/utils/query.key";
import { searchSchema, searchType } from "@/validations/profile/create.avatar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Amphora,
  BookmarkIcon,
  Heart,
  MessageSquareText,
  RefreshCcwIcon,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AllPosts() {
  const [searchName, setSearchName] = useState("");
  const {
    isLoading,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isSuccess,
    isError,
    error,
  } = useAllPosts({ name: searchName });
  const queryCLient = useQueryClient();
  const like = useToggleLike();
  const queryClient = useQueryClient();
  const handleLike = (id: string) => {
    like.mutate(
      { id, type: "POST" },
      {
        onSuccess: (results) => {
          queryClient.invalidateQueries({ queryKey: [queryKeys.POSTS] });
          queryClient.invalidateQueries({ queryKey: [queryKeys.ALL_POSTS] });
          console.log(results);
        },
        onError: (errors) => {
          console.error(errors.error);
          console.error(errors);
        },
      },
    );
  };
  const handleFollow = (id: string) => {}
  const { register, handleSubmit } = useForm<searchType>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit: SubmitHandler<searchType> = (searched) => {
    if (!searched.name) return setSearchName("");
    setSearchName(searched.name);
    queryCLient.invalidateQueries({ queryKey: [queryKeys.ALL_POSTS] });
  };
  const profileId = useProfileStore((state) => state.id);
  const followings = useProfileStore((state) => state.followings);
  const savedPosts = useProfileStore((state) => state.savedPosts);

  if (isLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Spinner className="size-8" />
      </div>
    );
  if (isError) return <div>Something went wrong{error.message}</div>;

  if (isSuccess)
    return (
      <div className="flex flex-col w-full max-w-2xl mx-auto gap-6 p-4">
        <FieldGroup className="w-full flex justify-center mb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ButtonGroup className="w-full max-w-md mx-auto flex justify-center">
              <Input
                placeholder="Search by profile name"
                {...register("name")}
              />
              <Button variant="outline" aria-label="Search" type="submit">
                <SearchIcon />
              </Button>
            </ButtonGroup>
          </form>
        </FieldGroup>
        <ItemGroup className="flex flex-col gap-3">
          {data.pages.map((page, pgIdx) => (
            <Fragment key={pgIdx}>
              {page.data.posts.length === 0 && (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Amphora />
                    </EmptyMedia>
                    <EmptyTitle>Post Unavailable</EmptyTitle>
                    <EmptyDescription className="max-w-xs text-pretty">
                      No profile matched
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button variant="outline" onClick={() => setSearchName("")}>
                      <RefreshCcwIcon />
                      Refresh
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
              {page.data.posts.map((post) => {
                const isFollowing = !!followings.includes(post.profile.id);
                const isLiked = !!post.likes.some(
                  (l) => l.profileId === profileId,
                );
                return (
                  <Card
                    key={post.id}
                    className="overflow-hidden border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl bg-card/50 backdrop-blur-sm"
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-3 px-4 pt-4">
                      <Link href={`/profiles/${post.profile.id}`}>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={post.profile.avatarUrl} />
                            <AvatarFallback>
                              {post.profile.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-sm">
                            {post.profile.name}
                          </span>
                        </div>
                      </Link>
                      {!isFollowing && (
                        <Button
                          size="sm"
                          className="rounded-full px-4 h-8 text-xs"
                          onClick={() =>
                            handleFollow(post.profile.id)
                          }
                        >
                          Follow
                        </Button>
                      )}
                    </CardHeader>

                    <Separator />

                    <CardContent className="px-5 pt-4 pb-3">
                      {" "}
                      <p className="font-medium text-base text-foreground mb-1.5 leading-snug">
                        {post.caption}
                      </p>
                      {post.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {" "}
                          {post.description}
                        </p>
                      )}
                    </CardContent>

                    <CardContent className="px-4 pb-3">
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent className="-ml-2">
                          {post.postPhoto.map((photo) => {
                            const isSavedPost = savedPosts.includes(photo.id);
                            return (
                              <CarouselItem
                                key={photo.id}
                                className="basis-1/2 md:basis-1/3 pl-2"
                              >
                                <div className="group relative overflow-hidden rounded-xl border border-border/30 shadow-sm transition-all duration-300">
                                  <AspectRatio ratio={1 / 1.5}>
                                    <Image
                                      src={photo.mediaUrl}
                                      alt={photo.id}
                                      fill
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                  </AspectRatio>

                                  <div
                                    className={cn(
                                      "absolute inset-0 flex items-center justify-center transition-all duration-300",
                                      "opacity-0 group-hover:opacity-100 group-hover:bg-black/40",
                                    )}
                                  >
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="transition-transform duration-300 transform scale-90 group-hover:scale-100">
                                          <Toggle
                                            aria-label="Toggle bookmark"
                                            variant="outline"
                                            disabled={!isFollowing}
                                            pressed={isSavedPost}
                                            className={cn(
                                              "h-12 w-12 rounded-full border-white/20 bg-background/30 backdrop-blur-sm shadow-xl transition-all",
                                              "text-white hover:bg-background/50 hover:text-white",
                                              "data-[state=on]:bg-white data-[state=on]:border-white data-[state=on]:text-black",
                                            )}
                                          >
                                            <BookmarkIcon
                                              className={cn(
                                                "h-5 w-5 transition-all",
                                                "group-data-[state=on]:fill-current",
                                              )}
                                            />
                                          </Toggle>
                                        </span>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="bottom"
                                        className="text-xs"
                                      >
                                        {isFollowing ? (
                                          <p>Save Post Media</p>
                                        ) : (
                                          <p>Follow to save the media</p>
                                        )}
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </div>
                              </CarouselItem>
                            );
                          })}
                        </CarouselContent>

                        <div className="flex justify-end gap-2 mt-3">
                          <CarouselPrevious className="static translate-y-0 h-8 w-8" />
                          <CarouselNext className="static translate-y-0 h-8 w-8" />
                        </div>
                      </Carousel>
                    </CardContent>

                    <Separator />

                    <CardFooter className="flex items-center gap-2 px-4 py-3">
                      <Toggle
                        aria-label="Toggle like"
                        size="sm"
                        variant={"outline"}
                        pressed={isLiked}
                        onClick={() => handleLike(post.id)}
                        className="flex gap-2 text-sm h-9 px-3 rounded-full hover:bg-rose-50 hover:text-rose-600 data-[state=on]:text-rose-600 data-[state=on]:bg-rose-50 transition-colors"
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 transition-all",
                            isLiked ? "fill-current" : "",
                          )}
                        />
                        <span className="font-medium">Like</span>
                      </Toggle>
                      <Toggle
                        aria-label="Toggle like"
                        size="sm"
                        variant={"outline"}
                        className="flex gap-2 text-sm h-9 px-3 rounded-full hover:bg-rose-50 hover:text-rose-600 data-[state=on]:text-rose-600 data-[state=on]:bg-rose-50 transition-colors"
                      >
                        <MessageSquareText className="h-3.5 w-3.5" />
                        {post._count.comments}
                      </Toggle>
                    </CardFooter>
                  </Card>
                );
              })}
            </Fragment>
          ))}
          {hasNextPage && (
            <Field>
              <Button
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? "Loading" : "Load More"}
              </Button>
            </Field>
          )}
        </ItemGroup>
      </div>
    );
  return null;
}
