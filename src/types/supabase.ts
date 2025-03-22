export type UserRole = 'admin' | 'user';

export interface UserMetadata {
  role: UserRole;
}

export interface User {
  id: string;
  email: string;
  user_metadata: UserMetadata;
}
