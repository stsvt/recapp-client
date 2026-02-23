export interface Movie {
  id: number;
  title: string;
  original_title: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  overview: string;
  genres: Genre[];
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  recommendations: {
    results: MovieSummary[];
  };
}

export interface MovieSummary {
  id: number;
  title: string;
  backdrop_path?: string;
  poster_path?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CrewMember {
  id: string;
  job: string;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
}

export interface BaseWork {
  id: number;
  title: string;
  media_type: 'movie' | 'tv';
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface ActorMovie extends BaseWork {
  character: string;
}

export interface PersonData {
  movies?: ActorMovie[];
  works?: BaseWork[];
}

export interface PersonDetails {
  id: number;
  name: string;
  name_en?: string;
  profile_path: string | null;
  birthday?: string;
  place_of_birth?: string;
  biography?: string;
  movies?: ActorMovie[];
  works?: BaseWork[];
}
