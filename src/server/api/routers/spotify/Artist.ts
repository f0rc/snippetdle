export interface ArtistAPIType {
  artists: Artists;
}

export interface Artists {
  href: string;
  items: Item[];
  limit: number;
  next: string;
  offset: number;
  previous: null;
  total: number;
}

export interface Item {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: "artist";
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

export enum Type {
  Artist = "artist",
}

export const fakeData: ArtistAPIType = {
  artists: {
    href: "https://api.spotify.com/v1/search?query=olivia&type=artist&locale=*&offset=0&limit=20",
    items: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/1McMsnEElThX1knmY4oliG",
        },
        followers: {
          href: null,
          total: 31184521,
        },
        genres: ["pop"],
        href: "https://api.spotify.com/v1/artists/1McMsnEElThX1knmY4oliG",
        id: "1McMsnEElThX1knmY4oliG",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5ebe03a98785f3658f0b6461ec4",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab67616100005174e03a98785f3658f0b6461ec4",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f178e03a98785f3658f0b6461ec4",
            width: 160,
          },
        ],
        name: "Olivia Rodrigo",
        popularity: 87,
        type: "artist",
        uri: "spotify:artist:1McMsnEElThX1knmY4oliG",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/5YBSzuCs7WaFKNr7Bky0Uf",
        },
        followers: {
          href: null,
          total: 26572,
        },
        genres: [],
        href: "https://api.spotify.com/v1/artists/5YBSzuCs7WaFKNr7Bky0Uf",
        id: "5YBSzuCs7WaFKNr7Bky0Uf",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb8e5262a32a4deabd237e4392",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab676161000051748e5262a32a4deabd237e4392",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f1788e5262a32a4deabd237e4392",
            width: 160,
          },
        ],
        name: "Olivia",
        popularity: 63,
        type: "artist",
        uri: "spotify:artist:5YBSzuCs7WaFKNr7Bky0Uf",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/00x1fYSGhdqScXBRpSj3DW",
        },
        followers: {
          href: null,
          total: 272728,
        },
        genres: ["pop soul", "uk pop"],
        href: "https://api.spotify.com/v1/artists/00x1fYSGhdqScXBRpSj3DW",
        id: "00x1fYSGhdqScXBRpSj3DW",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb21c1b52c26e9bf7b4d5ccf44",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab6761610000517421c1b52c26e9bf7b4d5ccf44",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f17821c1b52c26e9bf7b4d5ccf44",
            width: 160,
          },
        ],
        name: "Olivia Dean",
        popularity: 63,
        type: "artist",
        uri: "spotify:artist:00x1fYSGhdqScXBRpSj3DW",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/1QRj3hoop9Mv5VvHQkwPEp",
        },
        followers: {
          href: null,
          total: 2024380,
        },
        genres: ["alt z", "pop"],
        href: "https://api.spotify.com/v1/artists/1QRj3hoop9Mv5VvHQkwPEp",
        id: "1QRj3hoop9Mv5VvHQkwPEp",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5ebe594ac25931d59f2ac6bea0f",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab67616100005174e594ac25931d59f2ac6bea0f",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f178e594ac25931d59f2ac6bea0f",
            width: 160,
          },
        ],
        name: "Olivia O'Brien",
        popularity: 63,
        type: "artist",
        uri: "spotify:artist:1QRj3hoop9Mv5VvHQkwPEp",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/4BoRxUdrcgbbq1rxJvvhg9",
        },
        followers: {
          href: null,
          total: 1480157,
        },
        genres: [
          "adult standards",
          "australian dance",
          "disco",
          "mellow gold",
          "soft rock",
        ],
        href: "https://api.spotify.com/v1/artists/4BoRxUdrcgbbq1rxJvvhg9",
        id: "4BoRxUdrcgbbq1rxJvvhg9",
        images: [
          {
            height: 1318,
            url: "https://i.scdn.co/image/a9c4bea41f06c1be30efa9e06cb6e1a07f27e3f5",
            width: 1000,
          },
          {
            height: 844,
            url: "https://i.scdn.co/image/5943a71c83bb57c9007c13005ad18cd46bdd6edf",
            width: 640,
          },
          {
            height: 264,
            url: "https://i.scdn.co/image/a6d2cbfccec2b25a84861c04d7d132414dbd543a",
            width: 200,
          },
          {
            height: 84,
            url: "https://i.scdn.co/image/1d79d76e9f3d51972ea43e8b4542dcee7f76a8b2",
            width: 64,
          },
        ],
        name: "Olivia Newton-John",
        popularity: 65,
        type: "artist",
        uri: "spotify:artist:4BoRxUdrcgbbq1rxJvvhg9",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/6md7K2UM0UBU0fzI5erQCb",
        },
        followers: {
          href: null,
          total: 29900,
        },
        genres: [],
        href: "https://api.spotify.com/v1/artists/6md7K2UM0UBU0fzI5erQCb",
        id: "6md7K2UM0UBU0fzI5erQCb",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb58158d1b43f476935627537f",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab6761610000517458158d1b43f476935627537f",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f17858158d1b43f476935627537f",
            width: 160,
          },
        ],
        name: "Olivia Olson",
        popularity: 53,
        type: "artist",
        uri: "spotify:artist:6md7K2UM0UBU0fzI5erQCb",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/5GIaRpKCtzquc5UUicqe50",
        },
        followers: {
          href: null,
          total: 10206,
        },
        genres: ["show tunes"],
        href: "https://api.spotify.com/v1/artists/5GIaRpKCtzquc5UUicqe50",
        id: "5GIaRpKCtzquc5UUicqe50",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb64dfa45459f43ed8d7dbbce1",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab6761610000517464dfa45459f43ed8d7dbbce1",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f17864dfa45459f43ed8d7dbbce1",
            width: 160,
          },
        ],
        name: "Olivia Foa'i",
        popularity: 52,
        type: "artist",
        uri: "spotify:artist:5GIaRpKCtzquc5UUicqe50",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/188VINPQh5dyNfLUkevKqf",
        },
        followers: {
          href: null,
          total: 1131511,
        },
        genres: ["post-teen pop"],
        href: "https://api.spotify.com/v1/artists/188VINPQh5dyNfLUkevKqf",
        id: "188VINPQh5dyNfLUkevKqf",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb78f5b8a5f2e1d6e30d6230b9",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab6761610000517478f5b8a5f2e1d6e30d6230b9",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f17878f5b8a5f2e1d6e30d6230b9",
            width: 160,
          },
        ],
        name: "Olivia Holt",
        popularity: 46,
        type: "artist",
        uri: "spotify:artist:188VINPQh5dyNfLUkevKqf",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4",
        },
        followers: {
          href: null,
          total: 83143305,
        },
        genres: [
          "canadian hip hop",
          "canadian pop",
          "hip hop",
          "pop rap",
          "rap",
        ],
        href: "https://api.spotify.com/v1/artists/3TVXtAsR1Inumwj472S9r4",
        id: "3TVXtAsR1Inumwj472S9r4",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab676161000051744293385d324db8558179afd9",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f1784293385d324db8558179afd9",
            width: 160,
          },
        ],
        name: "Drake",
        popularity: 96,
        type: "artist",
        uri: "spotify:artist:3TVXtAsR1Inumwj472S9r4",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/12OSqKGORygb2C6H36qKuj",
        },
        followers: {
          href: null,
          total: 156559,
        },
        genres: [
          "chanson",
          "french pop",
          "french rock",
          "nouvelle chanson francaise",
        ],
        href: "https://api.spotify.com/v1/artists/12OSqKGORygb2C6H36qKuj",
        id: "12OSqKGORygb2C6H36qKuj",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb1901412c66270f5b3109d656",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab676161000051741901412c66270f5b3109d656",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f1781901412c66270f5b3109d656",
            width: 160,
          },
        ],
        name: "Olivia Ruiz",
        popularity: 45,
        type: "artist",
        uri: "spotify:artist:12OSqKGORygb2C6H36qKuj",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/0S3L5s6PIqKBIu21j910N1",
        },
        followers: {
          href: null,
          total: 14788,
        },
        genres: ["boston folk"],
        href: "https://api.spotify.com/v1/artists/0S3L5s6PIqKBIu21j910N1",
        id: "0S3L5s6PIqKBIu21j910N1",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb7f1bc286bd5e165f31ba2925",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab676161000051747f1bc286bd5e165f31ba2925",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f1787f1bc286bd5e165f31ba2925",
            width: 160,
          },
        ],
        name: "Olivia Barton",
        popularity: 40,
        type: "artist",
        uri: "spotify:artist:0S3L5s6PIqKBIu21j910N1",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/3JU9NLB27wyGhbwbApR9uy",
        },
        followers: {
          href: null,
          total: 20036,
        },
        genres: ["neo-classical"],
        href: "https://api.spotify.com/v1/artists/3JU9NLB27wyGhbwbApR9uy",
        id: "3JU9NLB27wyGhbwbApR9uy",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb381b9ea9b52df336206d4715",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab67616100005174381b9ea9b52df336206d4715",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f178381b9ea9b52df336206d4715",
            width: 160,
          },
        ],
        name: "Olivia Belli",
        popularity: 51,
        type: "artist",
        uri: "spotify:artist:3JU9NLB27wyGhbwbApR9uy",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/4a2nAPF15Gv8V65Ba3IJSB",
        },
        followers: {
          href: null,
          total: 57325,
        },
        genres: ["chamber pop", "elephant 6", "lo-fi", "noise pop"],
        href: "https://api.spotify.com/v1/artists/4a2nAPF15Gv8V65Ba3IJSB",
        id: "4a2nAPF15Gv8V65Ba3IJSB",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab67616d0000b2733e046d6de331a47175ee2fbb",
            width: 640,
          },
          {
            height: 300,
            url: "https://i.scdn.co/image/ab67616d00001e023e046d6de331a47175ee2fbb",
            width: 300,
          },
          {
            height: 64,
            url: "https://i.scdn.co/image/ab67616d000048513e046d6de331a47175ee2fbb",
            width: 64,
          },
        ],
        name: "The Olivia Tremor Control",
        popularity: 37,
        type: "artist",
        uri: "spotify:artist:4a2nAPF15Gv8V65Ba3IJSB",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/5Jz3hRmQLFa6dwHoKcPtSW",
        },
        followers: {
          href: null,
          total: 4145,
        },
        genres: [],
        href: "https://api.spotify.com/v1/artists/5Jz3hRmQLFa6dwHoKcPtSW",
        id: "5Jz3hRmQLFa6dwHoKcPtSW",
        images: [],
        name: "Olivia Olson",
        popularity: 46,
        type: "artist",
        uri: "spotify:artist:5Jz3hRmQLFa6dwHoKcPtSW",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/56o9EclNeDcE7p8txENfLn",
        },
        followers: {
          href: null,
          total: 45150,
        },
        genres: ["romanian pop"],
        href: "https://api.spotify.com/v1/artists/56o9EclNeDcE7p8txENfLn",
        id: "56o9EclNeDcE7p8txENfLn",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb9b82ba951010d6b48686638b",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab676161000051749b82ba951010d6b48686638b",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f1789b82ba951010d6b48686638b",
            width: 160,
          },
        ],
        name: "Olivia Addams",
        popularity: 44,
        type: "artist",
        uri: "spotify:artist:56o9EclNeDcE7p8txENfLn",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/74KM79TiuVKeVCqs8QtB0B",
        },
        followers: {
          href: null,
          total: 6810512,
        },
        genres: ["pop"],
        href: "https://api.spotify.com/v1/artists/74KM79TiuVKeVCqs8QtB0B",
        id: "74KM79TiuVKeVCqs8QtB0B",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb00e540b760b56d02cc415c47",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab6761610000517400e540b760b56d02cc415c47",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f17800e540b760b56d02cc415c47",
            width: 160,
          },
        ],
        name: "Sabrina Carpenter",
        popularity: 81,
        type: "artist",
        uri: "spotify:artist:74KM79TiuVKeVCqs8QtB0B",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/1Sf6NYl5JYaX33TOvzbD5U",
        },
        followers: {
          href: null,
          total: 10598,
        },
        genres: [],
        href: "https://api.spotify.com/v1/artists/1Sf6NYl5JYaX33TOvzbD5U",
        id: "1Sf6NYl5JYaX33TOvzbD5U",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb446599221e5dc14476454897",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab67616100005174446599221e5dc14476454897",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f178446599221e5dc14476454897",
            width: 160,
          },
        ],
        name: "Olivia Georgia",
        popularity: 28,
        type: "artist",
        uri: "spotify:artist:1Sf6NYl5JYaX33TOvzbD5U",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/3Og5as5vV5n1iTR5iaNNZ6",
        },
        followers: {
          href: null,
          total: 31574,
        },
        genres: ["country pop"],
        href: "https://api.spotify.com/v1/artists/3Og5as5vV5n1iTR5iaNNZ6",
        id: "3Og5as5vV5n1iTR5iaNNZ6",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb913ac3564d005abe37d73eba",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab67616100005174913ac3564d005abe37d73eba",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f178913ac3564d005abe37d73eba",
            width: 160,
          },
        ],
        name: "Olivia Lane",
        popularity: 33,
        type: "artist",
        uri: "spotify:artist:3Og5as5vV5n1iTR5iaNNZ6",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/0hCNtLu0JehylgoiP8L4Gh",
        },
        followers: {
          href: null,
          total: 30375930,
        },
        genres: ["hip pop", "pop", "queens hip hop", "rap"],
        href: "https://api.spotify.com/v1/artists/0hCNtLu0JehylgoiP8L4Gh",
        id: "0hCNtLu0JehylgoiP8L4Gh",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab6761610000e5eb07a50f0a9a8f11e5a1102cbd",
            width: 640,
          },
          {
            height: 320,
            url: "https://i.scdn.co/image/ab6761610000517407a50f0a9a8f11e5a1102cbd",
            width: 320,
          },
          {
            height: 160,
            url: "https://i.scdn.co/image/ab6761610000f17807a50f0a9a8f11e5a1102cbd",
            width: 160,
          },
        ],
        name: "Nicki Minaj",
        popularity: 88,
        type: "artist",
        uri: "spotify:artist:0hCNtLu0JehylgoiP8L4Gh",
      },
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/0n4VpRA6e5Cd3snLrusqeA",
        },
        followers: {
          href: null,
          total: 50,
        },
        genres: ["sleep"],
        href: "https://api.spotify.com/v1/artists/0n4VpRA6e5Cd3snLrusqeA",
        id: "0n4VpRA6e5Cd3snLrusqeA",
        images: [
          {
            height: 640,
            url: "https://i.scdn.co/image/ab67616d0000b2730a073340442aaa58660de4c1",
            width: 640,
          },
          {
            height: 300,
            url: "https://i.scdn.co/image/ab67616d00001e020a073340442aaa58660de4c1",
            width: 300,
          },
          {
            height: 64,
            url: "https://i.scdn.co/image/ab67616d000048510a073340442aaa58660de4c1",
            width: 64,
          },
        ],
        name: "Olivia Line",
        popularity: 40,
        type: "artist",
        uri: "spotify:artist:0n4VpRA6e5Cd3snLrusqeA",
      },
    ],
    limit: 20,
    next: "https://api.spotify.com/v1/search?query=olivia&type=artist&locale=*&offset=20&limit=20",
    offset: 0,
    previous: null,
    total: 373,
  },
};
