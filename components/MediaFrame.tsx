import Image from 'next/image';

type Props = {
  /** What the frame will hold, e.g. "Product screen: approvals queue". Shown until src exists. */
  label: string;
  /** Real screen or poster, once supplied. Placed in /public/product/. */
  src?: string;
  alt?: string;
  ratio?: 'product' | 'video';
  caption?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Holds a product screen or video at its real aspect ratio. Until the asset exists it renders a
 * clearly labelled placeholder, so no layout shifts when the real file arrives.
 * Every placeholder label is listed in redesign/HANDOFF.md.
 */
export function MediaFrame({ label, src, alt, ratio = 'product', caption, priority, sizes = '(min-width: 1024px) 60vw, 100vw' }: Props) {
  const aspect = ratio === 'video' ? 'aspect-video' : 'aspect-product';
  return (
    <figure className="m-0">
      <div className={`relative overflow-hidden rounded-frame border border-rule bg-mist ${aspect}`}>
        {src ? (
          <Image src={src} alt={alt ?? label} fill sizes={sizes} priority={priority} className="object-cover object-top" />
        ) : (
          <div
            role="img"
            aria-label={`Placeholder: ${label}`}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-none stroke-rule-strong" strokeWidth="1.5">
              {ratio === 'video' ? (
                <path d="M9 7.5v9l7.5-4.5L9 7.5Z" strokeLinejoin="round" />
              ) : (
                <>
                  <rect x="3" y="4" width="18" height="14" rx="2" />
                  <path d="M3 8h18M8 21h8" />
                </>
              )}
            </svg>
            <p className="text-sm font-medium text-graphite">{label}</p>
            <p className="text-xs text-slate">{ratio === 'video' ? 'Coming soon' : 'Real screen to be added'}</p>
          </div>
        )}
      </div>
      {caption ? <figcaption className="mt-3 text-xs text-slate">{caption}</figcaption> : null}
    </figure>
  );
}
