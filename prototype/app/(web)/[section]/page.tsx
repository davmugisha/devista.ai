import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotDesigned } from '@/components/NotDesigned';
import { WebPage } from '@/components/web/WebPage';
import { SECTIONS, isSection, type SectionKey } from '@/lib/data';
import { web } from '@/lib/routes';

export function generateStaticParams() {
  return (Object.keys(SECTIONS) as SectionKey[]).map((section) => ({ section }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  return { title: isSection(section) ? SECTIONS[section].title : 'Not found' };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  return (
    <WebPage className="justify-center">
      <NotDesigned
        section={section}
        links={[
          { label: 'Go to Home', href: web.home },
          { label: 'Inbox', href: web.inbox() },
          { label: 'Marketplace', href: web.marketplace },
        ]}
      />
    </WebPage>
  );
}
