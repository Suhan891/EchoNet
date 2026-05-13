-- DropForeignKey
ALTER TABLE "Reel" DROP CONSTRAINT "Reel_profileId_fkey";

-- DropForeignKey
ALTER TABLE "StoryViews" DROP CONSTRAINT "StoryViews_viewerId_fkey";

-- AddForeignKey
ALTER TABLE "Reel" ADD CONSTRAINT "Reel_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryViews" ADD CONSTRAINT "StoryViews_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
