export interface PlayerData {
  full_name: string;
  role?: string;
  location?: string;
}

export interface Player extends PlayerData {
  id: number;
  user_id?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerSearchQuery {
  id?: string;
  name?: string;
  role?: string;
  location?: string;
}
