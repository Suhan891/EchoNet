import { ProfileState } from "@/types/profile.details";
import { create } from "zustand";


export const useProfileStore = create<ProfileState>(
    (set) => ({
         id: '',
           name: '',
           bio: '',
           avatarUrl: '',
           followers: [],
           followings: [],
           storyId: '',
           sentNotifications: [],
         
           setId: (id) => set({id}),
           setName: (name) => set({name}),
           setBio: (bio) => set({bio}),
           setAvatar: (avatarUrl) => set({avatarUrl}),
           setFollowers: (followers) => set({followers}),
           setFollowinngs: (followings) => set({followings}),
           setStoryId: (storyId) => set({storyId}),
           setNotification: (sentNotifications) => set({sentNotifications}),
    })
)
