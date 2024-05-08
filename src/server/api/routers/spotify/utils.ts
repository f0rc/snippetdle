import { gt } from "drizzle-orm";
import { env } from "~/env";
import type { dbType } from "~/server/db";
import { spotifySecret } from "~/server/db/schema";

export interface SpotifyResponse {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: null;
  total: number;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Owner {
  display_name?: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: OwnerType;
  uri: string;
  name?: string;
}

export enum OwnerType {
  Artist = "artist",
  User = "user",
}

export interface Tracks {
  href: string;
  items: Item[];
  limit: number;
  next: null;
  offset: number;
  previous: null;
  total: number;
}

export interface Item {
  added_at: Date;
  added_by: Owner;
  is_local: boolean;
  primary_color: null;
  track: Track;
  video_thumbnail: VideoThumbnail;
}

export interface Track {
  album: Album;
  artists: Owner[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: null | string;
  track: boolean;
  track_number: number;
  type: TrackType;
  uri: string;
}

export interface Album {
  album_type: AlbumTypeEnum;
  artists: Owner[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: ReleaseDatePrecision;
  total_tracks: number;
  type: AlbumTypeEnum;
  uri: string;
}

export enum AlbumTypeEnum {
  Album = "album",
  Single = "single",
}

export enum ReleaseDatePrecision {
  Day = "day",
  Month = "month",
  Year = "year",
}

export interface ExternalIDS {
  isrc: string;
}

export enum TrackType {
  Track = "track",
}

export interface VideoThumbnail {
  url: null;
}

export const getSpotifyToken = async ({ db }: { db: dbType }) => {
  const spotifyAccessToken = await db.query.spotifySecret.findFirst({
    where: gt(spotifySecret.expires_in, new Date().valueOf().toString()),
  });

  let token = spotifyAccessToken?.access_token;

  // Token not found or expired so fetch new one from spotify api and save it to db
  if (!spotifyAccessToken) {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", env.AUTH_SPOTIFY_CLIENT_ID);
    params.append("client_secret", env.AUTH_SPOTIFY_CLIENT_SECRET);

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch token");
    }
    const tokenFromApi = (await res.json()) as spotifyAccessTokenReturnType;
    // console.log("getting new access token");
    const expires = new Date().valueOf() + tokenFromApi.expires_in * 1000;
    await db.insert(spotifySecret).values({
      access_token: tokenFromApi.access_token,
      expires_in: expires.toString(),
    });

    token = tokenFromApi.access_token;
  }

  return token;
};

export interface spotifyAccessTokenReturnType {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
}
