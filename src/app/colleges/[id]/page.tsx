import { mockColleges } from '@/lib/mockDb';
import CollegeDetailPage from './CollegeDetailClient';

interface Params {
  id: string;
}

// Pre-render pages for all college IDs and slugs statically
export function generateStaticParams() {
  const params: { id: string }[] = [];
  mockColleges.forEach((c) => {
    params.push({ id: c.id });
    params.push({ id: c.slug });
  });
  return params;
}

export default function Page({ params }: { params: Promise<Params> }) {
  return <CollegeDetailPage params={params} />;
}
