"use client";
import { signIn } from "next-auth/react";

const page = () => {
  return (
    <div className="flex h-screen w-full flex-grow flex-col flex-wrap items-center  justify-center overflow-scroll bg-gradient-to-b from-[#050808] to-[#121212] pb-10 text-[#EAF2F5] sm:flex-nowrap">
      <div className="flex flex-col items-start justify-between gap-2 rounded-3xl bg-white px-8 py-12 text-black shadow-lg lg:w-1/3 lg:max-w-md">
        <div className="flex flex-col gap-2">
          <a className="flex items-center gap-2" href={"/"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 cursor-pointer text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>

            {/* <p className="text-gray-700">Go back</p> */}
          </a>
          <h1 className="relative flex flex-row items-baseline text-2xl font-bold">
            <span className="sr-only">Game</span>
            <span className="tracking-tight text-black">Game</span>
          </h1>

          <h1 className="mt-6 text-xl font-extrabold">Sign In</h1>
          <p className="text-gray-500">
            to continue to <span className="font-bold">Game</span>
          </p>
        </div>

        <div className="flex w-full flex-col">
          <button
            className="flex w-full justify-center gap-4 rounded border border-gray-200 bg-white px-3 py-2 hover:bg-gray-300/50 disabled:opacity-60"
            onClick={() => signIn("spotify")}
          >
            <svg
              width={24}
              hanging={24}
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Spotify</title>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <p>Sign in with Spotify</p>
          </button>

          <button
            className="flex w-full justify-center gap-4 rounded border border-gray-200 bg-white px-3 py-2 hover:bg-gray-300/50 disabled:opacity-60"
            onClick={() => signIn("discord", { callbackUrl: "/" })}
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
            >
              <title>Discord</title>
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
            </svg>
            <p>Sign in with Discord</p>
          </button>
          {/* <button
            className="flex w-full justify-center gap-4 rounded border border-gray-200 bg-white px-3 py-2 hover:bg-gray-300/50 disabled:opacity-60"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
            >
              <title>Google</title>
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            <p>Sign in with Google</p>
          </button> */}
        </div>
      </div>

      <p className="pt-5">
        By signing in, you agree to our{" "}
        <a href="#" className="text-blue-500 underline">
          Terms of Service
        </a>
      </p>
    </div>
  );
};

export default page;
