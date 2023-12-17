import CreateGame from "./createGame";

async function page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16">
        <CreateGame />
      </div>
    </main>
  );
}

export default page;
