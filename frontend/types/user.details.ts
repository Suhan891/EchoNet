export enum Role {
  "ADMIN",
  "USER",
}
export interface UserResponse {
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
}

export interface AuthState {
  email: string;
  username: string;
  role: Role;
  profiles: authAllProfiles[];
  setEmail: (email: string) => void;
  setRole: (role:Role) => void;
  setUserName: (name: string) => void;
  setProfile: (profiles: authAllProfiles[]) => void;
}
