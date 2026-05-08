export interface PostRequestData {
  id: string;
  caption: string;
  description: string;
  postPhoto: {
    id: string;
    mediaUrl: string;
  }[];
  likes: {
    profileId: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export interface AllPosts {
  posts: {
    id: string;
    caption: string;
    description: string;
    likes: {
      profileId: string;
    }[];
    profile: {
      id: string;
      name: string;
      avatarUrl: string;
    };
    postPhoto: {
      id: string;
      mediaUrl: never;
      order: never;
    }[];
    _count: {
      comments: number;
    };
  }[];
  meta: {
    currentPage: number;
    currentReels: number;
    totalPages: number;
    totalItems: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface SavedPosts {
  post: {
    post: {
      profile: {
        name: string;
        avatarUrl: string;
      };
    };
    id: string;
    mediaUrl: string;
  };
}
