export enum Role {
  "ADMIN",
  "USER",
}
export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: Role;
  profile: {
    isActive: boolean;
    id: string;
  }[];
}

export interface authAllProfiles {
  id: string;
  isActive: boolean;
  avatarUrl: string;
  name: string;
}

export interface AuthState {
  userId: string;
  email: string;
  username: string;
  role: Role;
  profiles: authAllProfiles[];
  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: Role) => void;
  setUserName: (name: string) => void;
  setProfile: (profiles: authAllProfiles[]) => void;
}
