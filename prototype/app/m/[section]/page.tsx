import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotDesigned } from '@/components/NotDesigned';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { Icon } from '@/components/icons';
import { ButtonLink } from '@/components/ui';
import { SECTIONS, isSection, type SectionKey } from '@/lib/data';
import { phone } from '@/lib/routes';

export function generateStaticParams() {
  return (Object.keys(SECTIONS) as SectionKey[]).map((section) => ({ section }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  return { title: isSection(section) ? SECTIONS[section].title : 'Not found' };
}

export default async function PhoneSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  return (
    <PhoneScreen className="gap-6 overflow-y-auto px-5 pt-14 pb-8">
      <ButtonLink href={phone.menu} isIconOnly variant="ghost" aria-label="Back to the menu" className="size-12 min-w-12 rounded-full bg-surface">
        <Icon name="back" size={22} />
      </ButtonLink>
      <NotDesigned
        section={section}
        links={[
          { label: 'Brain Map', href: phone.home },
          { label: 'Inbox', href: phone.inbox() },
        ]}
      />
    </PhoneScreen>
  );
}
