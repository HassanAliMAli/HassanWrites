import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
        Welcome to HassanWrites
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400 sm:text-xl md:text-2xl">
        A personal blog where I share my thoughts on technology, programming, and life.
      </p>
      <div className="mt-8">
        <Link href="/blog" className="inline-block rounded-full bg-blue-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-blue-700">
          Read the Blog
        </Link>
      </div>
    </div>
  );
}