CREATE TABLE IF NOT EXISTS "Song" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"preview_url" text,
	"album_name" text NOT NULL,
	"album_image" text,
	"album_release_date" text,
	"artist_name" text NOT NULL,
	"playlistId" text NOT NULL,
	"createdById" varchar NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playlist" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"createdById" varchar NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "playlistOnSong" (
	"playlistId" text NOT NULL,
	"songId" uuid NOT NULL,
	CONSTRAINT "playlistOnSong_playlistId_songId_pk" PRIMARY KEY("playlistId","songId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"createdById" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spotifySecret" (
	"access_token" text PRIMARY KEY NOT NULL,
	"expires_in" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"playlistId" text[],
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id_idx" ON "Song" ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accountUserId_idx" ON "account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "createdById_idx" ON "post" ("createdById");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "post" ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userId_idx" ON "session" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "spotifyIndex" ON "spotifySecret" ("access_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "moneyIndex" ON "testing" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
