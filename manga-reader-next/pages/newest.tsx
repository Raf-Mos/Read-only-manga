import Head from 'next/head';
import NewestPage from '@/components/NewestPage';

export default function Page() {
  return (
    <>
      <Head><title>Newest - MangaReader</title></Head>
      <NewestPage />
    </>
  );
}