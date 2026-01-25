import type { User } from '../../../types/user';

export interface AuthState {
  loading: boolean;
  user: User | null;
  token: string | null;
}
