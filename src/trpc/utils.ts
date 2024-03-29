export interface dailyChallengeType {
  id: string;
  date: string;
  song: {
    id: string;
    preview_url: string;
    album_name: string;
    album_image: string;
    album_release_date: string;
    artist_name: string;
  };
}
