import Login from "../components/Login";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>B2M Library</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo-library.png" />
      </Head>
      <div className="h-screen flex justify-center items-center">
        <Login />
      </div>
    </>
  );
}
