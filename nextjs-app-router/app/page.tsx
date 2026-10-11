import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>FindIP Shield + Next.js</h1>
      <p>
        Shield starts in <code>app/shield.tsx</code>, rendered once from the root layout.
      </p>
      <p>
        <Link href="/signup">Open the signup form</Link>
      </p>
    </main>
  );
}
