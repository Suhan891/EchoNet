import { CircleUserRound, Images, Inbox, MessageSquare, Video } from "lucide-react";

export const items = [
    {
        title: 'Profile',
        url: '/profile',
        icon: CircleUserRound,
    },
    {
        title: 'Inbox',
        url: '#',
        icon: Inbox,
    },
    {
        title: 'Posts',
        url: '#',
        icon: Images,
    },
    {
        title: 'Reels',
        url: '#',
        icon: Video,
    },
    {
        title: 'Message',
        url: '#',
        icon: MessageSquare,
    },
]

export const headers = {
    SAVED_POSTS: 'Saved Posts',
    POSTS: 'Posts',
    REELS: 'Reels'
}