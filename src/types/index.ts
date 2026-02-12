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
  backdrop_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CrewMember {
  job: string;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
}