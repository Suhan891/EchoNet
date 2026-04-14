

export default function StoryLayout({children}: Readonly<{children: React.ReactNode}>){
    // Some checking logic => Get storyId's from profile id of user => isFetching...
    return (
        <div className="h-screen">{children}</div>
    )
}