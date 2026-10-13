import { ButtonLink } from '@/components/ui';
import { docs, phone, web } from '@/lib/routes';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="m-0 text-[30px] font-bold">This screen is not in the prototype</h1>
      <p className="m-0 text-[15px] font-semibold text-ink-3">Every designed screen is on the canvas.</p>
      <div className="flex flex-wrap justify-center gap-2">
        <ButtonLink href={docs.preview}>See every screen</ButtonLink>
        <ButtonLink href={web.home} variant="tertiary">
          Web app
        </ButtonLink>
        <ButtonLink href={phone.home} variant="tertiary">
          Phone app
        </ButtonLink>
      </div>
    </main>
  );
}
