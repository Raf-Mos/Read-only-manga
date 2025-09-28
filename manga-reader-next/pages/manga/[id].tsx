import Head from 'next/head';
import { useRouter } from 'next/router';
import MangaDetails from '@/components/MangaDetails';

export default function MangaDetailsPage() {
  const { query } = useRouter();
  const id = typeof query.id === 'string' ? query.id : '';
  return (
    <>
      <Head><title>Manga - MangaReader</title></Head>
      {id && <MangaDetails id={id} />}
    </>
  );
}