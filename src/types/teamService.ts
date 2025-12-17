export interface TeamData {
  name: string;
  short_name: string;
  logo_url?: string;
  location?: string;
}

export interface Team extends TeamData {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface TeamSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  searchBy?: string;
  sort?: 'ASC' | 'DESC';
  sortBy?: string;
}

export interface TeamSearchQuery {
  name?: string;
  location?: string;
}
