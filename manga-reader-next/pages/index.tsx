import Head from 'next/head';
import { useRouter } from 'next/router';
import Homepage from '@/components/Homepage';

export default function IndexPage() {
  const router = useRouter();
  const search = typeof router.query.search === 'string' ? router.query.search : undefined;
  return (
    <>
      <Head>
        <title>MangaReader</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Homepage searchQuery={search} />
    </>
  );
}