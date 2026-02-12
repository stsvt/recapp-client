import type { Genre } from "./genre";
import type { CastMember } from "./castMember";
import type { CrewMember } from "./crewMember";
import type { MovieSummary } from "./movieSummary";

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
