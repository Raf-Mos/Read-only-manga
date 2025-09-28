import Head from 'next/head';
import { useRouter } from 'next/router';
import ChapterReader from '@/components/ChapterReader';

export default function ChapterReaderPage() {
  const { query } = useRouter();
  const id = typeof query.id === 'string' ? query.id : '';
  return (
    <>
      <Head><title>Chapter - MangaReader</title></Head>
      {id && <ChapterReader id={id} />}
    </>
  );
}