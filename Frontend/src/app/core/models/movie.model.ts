export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string[];
  duration: number;
  rating: number;
  releaseDate: Date;
  posterUrl: string;
  trailerUrl?: string;
  language: string;
  isActive: boolean;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  theaterName: string;
  theaterIcon?: string;
  showDate: Date;
  showTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
}