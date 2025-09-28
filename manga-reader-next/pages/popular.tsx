import Head from 'next/head';
import PopularPage from '@/components/PopularPage';

export default function Page() {
  return (
    <>
      <Head><title>Popular - MangaReader</title></Head>
      <PopularPage />
    </>
  );
}