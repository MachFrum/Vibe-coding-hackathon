import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  // Next.js's redirect function throws an error to stop rendering and redirect.
  // Therefore, a return statement might not be strictly necessary here.
  // However, to satisfy React's component structure, returning null is a common practice.
  return null;
}
