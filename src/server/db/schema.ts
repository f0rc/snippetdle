import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const posts = pgTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accountUserId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const spotifySecret = pgTable(
  "spotifySecret",
  {
    access_token: text("access_token").primaryKey(),
    expires_in: numeric("expires_in").notNull(),
  },
  (spotifySecret) => ({
    spotifyIndex: index("spotifyIndex").on(spotifySecret.access_token),
  }),
);

export const Song = pgTable(
  "Song",
  {
    id: uuid("id").defaultRandom().notNull(),
    preview_url: text("preview_url"),
    album_name: text("album_name").notNull(),
    album_image: text("album_image"),
    album_release_date: text("album_release_date"),

    artist_name: text("artist_name").notNull(),

    playlistId: text("playlistId").array(),

    createdById: varchar("createdById").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
  },
  (song) => ({
    pk: primaryKey({ columns: [song.album_name, song.artist_name] }),
    songIndex: index("id_idx").on(song.id),
  }),
);

// export const SongRelations = relations(Song, ({ many }) => ({
//   // user: one(users, { fields: [playlist.createdById], references: [users.id] }),
//   playlist: many(playlist),
// }));

export const playlist = pgTable("playlist", {
  id: text("id").primaryKey(),
  name: varchar("name").notNull(),
  createdById: varchar("createdById").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt").default(sql`CURRENT_TIMESTAMP`),
});

export const playlistOnSong = pgTable(
  "playlistOnSong",
  {
    playlistId: text("playlistId").notNull(),
    songId: uuid("songId").notNull(),
  },
  (t) => ({
    compoundKey: primaryKey({ columns: [t.playlistId, t.songId] }),
  }),
);

// export const playlistRelations = relations(playlist, ({ many }) => ({
//   // user: one(users, { fields: [playlist.createdById], references: [users.id] }),
//   songs: many(Song),
// }));
