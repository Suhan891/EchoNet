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
    avatarUrl: string;
    name: string;
  }[];
}

export interface authAllProfiles {
  id: string;
  isActive: boolean;
  avatarUrl: string;
  name: string;
}
interface Job {
  name: 'POST' | 'STORY';
  id: string;
  status: "PROGRESS" | "FAILED";
}
// interface StatusUpdate {
//   id: string;
//   status: "PROGRESS" | "SUCCESS" | "FAILED";
// }
export interface AuthState {
  userId: string;
  email: string;
  username: string;
  role: Role;
  profiles: authAllProfiles[];
  jobs: Job[],
  setUserId: (userId: string) => void;
  setEmail: (email: string) => void;
  setRole: (role: Role) => void;
  setUserName: (name: string) => void;
  setProfile: (profiles: authAllProfiles[]) => void;
  setJob: (job: Job ) => void
  updateJobStatus: (id: string, status: "PROGRESS" | "FAILED") => void
  removeJob: (id: string) => void
}
