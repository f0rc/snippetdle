import { relations } from "drizzle-orm";
import { index, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const posts = pgTable(
  "post",
  (d) => ({
    id: d.serial().primaryKey(), // Use serial() instead of generatedByDefaultAsIdentity()
    name: d.varchar(),
    createdById: d.varchar().notNull(),
    created_at: d.timestamp().defaultNow().notNull(),
    updatedAt: d.timestamp(),
  }),
  (t) => [
    index("createdById_idx").on(t.createdById),
    index("name_idx").on(t.name),
  ],
);

export const users = pgTable("user", (d) => ({
  id: d.text().notNull().primaryKey(), // text, not varchar
  name: d.text(), // text, not varchar
  email: d.text().notNull(), // text, not varchar
  emailVerified: d.timestamp({ mode: "date" }), // No timezone
  image: d.text(), // text, not varchar
  role: d.text().notNull().default("user"), // text, not varchar
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = pgTable(
  "account",
  (d) => ({
    userId: d
      .text() // text, not varchar
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: d.text().$type<AdapterAccount["type"]>().notNull(), // text, not varchar
    provider: d.text().notNull(), // text, not varchar
    providerAccountId: d.text().notNull(), // text, not varchar
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.text(), // text, not varchar
    scope: d.text(), // text, not varchar
    id_token: d.text(),
    session_state: d.text(), // text, not varchar
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  (d) => ({
    sessionToken: d.text().notNull().primaryKey(), // text, not varchar
    userId: d
      .text() // text, not varchar
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: d.timestamp({ mode: "date" }).notNull(), // No timezone
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  (d) => ({
    identifier: d.text().notNull(), // text, not varchar
    token: d.text().notNull(), // text, not varchar
    expires: d.timestamp({ mode: "date" }).notNull(), // No timezone
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const spotifySecret = pgTable(
  "spotifySecret",
  (d) => ({
    access_token: d.text().primaryKey(),
    expires_in: d.numeric().notNull(),
  }),
  (t) => [index("spotifyIndex").on(t.access_token)],
);

export const Song = pgTable(
  "Song",
  (d) => ({
    id: d
      .uuid()
      .unique()
      .$defaultFn(() => crypto.randomUUID())
      .notNull(),
    preview_url: d.text().notNull(),
    album_name: d.text().notNull(),
    album_image: d.text().notNull(),
    album_release_date: d.text().notNull(),
    artist_name: d.text().notNull(),
    playlistId: d.text().array(),
    isChallengeSong: d.boolean().default(false),
    createdById: d.varchar().notNull(), // No length constraint
    created_at: d.timestamp().defaultNow().notNull(), // Use created_at, not createdAt
    updatedAt: d.timestamp(), // No timezone
  }),
  (t) => [
    primaryKey({ columns: [t.album_name, t.artist_name] }),
    index("id_idx").on(t.id),
  ],
);

export const playlist = pgTable("playlist", (d) => ({
  id: d.text().primaryKey(),
  name: d.varchar().notNull(), // No length constraint
  playlistImage: d.text(),
  playlistDescription: d.text(),
  createdById: d.varchar().notNull(), // No length constraint
  created_at: d.timestamp().defaultNow().notNull(), // Use created_at, not createdAt
  updatedAt: d.timestamp(), // No timezone
}));

export const dailyChallenge = pgTable("dailyChallenge", (d) => ({
  id: d
    .uuid()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  songId: d
    .uuid()
    .notNull()
    .references(() => Song.id, { onDelete: "cascade" }),
  date: d.date({ mode: "string" }).notNull(),
  createdById: d.varchar().notNull(), // No length constraint
  created_at: d.timestamp().defaultNow().notNull(), // Use created_at, not createdAt
  updatedAt: d.timestamp(), // No timezone
}));

export const artistSearchQuery = pgTable(
  "artistSearchQuery",
  (d) => ({
    searchParam: d.varchar({ length: 50 }).primaryKey(),
  }),
  (t) => [index("searchParamIdx").on(t.searchParam)],
);

export const artist = pgTable(
  "artist",
  (d) => ({
    id: d.text().primaryKey(),
    name: d.varchar().notNull(), // No length constraint
    popularity: d.integer().notNull().default(0),
    imageUrl: d.text(),
    genere: d.text().array(),
    queryparam: d.text().array(),
  }),
  (t) => [index("artistIdx").on(t.name)],
);

export const game = pgTable(
  "game",
  (d) => ({
    id: d
      .uuid()
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    userIp: d.text().notNull(),
    userAgent: d.text().notNull(),
    dailyChallenge: d.boolean().default(false).notNull(),
    playlistId: d.text().notNull(),
    songPlayed: d.uuid().array().notNull(), // Use songPlayed, not songsPlayed
    createdById: d.text().references(() => users.id),
    created_at: d.timestamp().defaultNow().notNull(), // Use created_at, not createdAt
    updatedAt: d.timestamp(), // No timezone
  }),
  (t) => [index("game_createdById_idx").on(t.createdById)],
);

export const roundInfo = pgTable("round_info", (d) => ({
  id: d
    .uuid()
    .$defaultFn(() => crypto.randomUUID())
    .primaryKey(),
  gameId: d
    .uuid()
    .references(() => game.id, { onDelete: "cascade" })
    .notNull(),
  isOver: d.boolean().default(false),
  game_songId: d // Use game_songId, not songId
    .uuid()
    .references(() => Song.id)
    .notNull(),
  attempts: d.integer().notNull(),
  guess: d.text().array(),
  createdById: d.text().references(() => users.id),
  created_at: d.timestamp().defaultNow().notNull(), // Use created_at, not createdAt
}));
