import type { Metadata } from 'next';
import styles from './monogram.module.css';

const asset = '/brand/concepts/reference-02-monogram.svg';
const maskStyle = { maskImage: `url("${asset}")`, WebkitMaskImage: `url("${asset}")` };

export const metadata: Metadata = {
  title: 'Circular monogram study',
  description: 'A refined vector design based on the supplied circular letter-logo reference.',
  robots: { index: false, follow: false },
};

function Mark({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`${styles.mark} ${className}`} style={maskStyle} />;
}

export default function MonogramStudy() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>Logo study / reference 02</p>
            <h1>The circular mark, <em>cleaned up.</em></h1>
          </div>
          <p>
            The ring is even, the opening is deliberate, and the inner strokes form one clear letter.
            The shape stays readable at icon size.
          </p>
        </div>

        <div className={styles.grid}>
          <figure className={styles.mainStage}>
            <figcaption>01 / Primary symbol</figcaption>
            <Mark className={styles.heroMark} />
            <div className={styles.stageBottom}><span>Refined circular letter</span><span>Single-colour vector</span></div>
          </figure>

          <div className={styles.applications}>
            <div className={styles.lockupCard}>
              <span className={styles.cardLabel}>02 / Saydeed lockup</span>
              <div className={styles.lockupSaydeed}><Mark className={styles.lockupMark} /><span>saydeed</span></div>
            </div>
            <div className={styles.lockupCard}>
              <span className={styles.cardLabel}>03 / Devista lockup</span>
              <div className={styles.lockupDevista}><Mark className={styles.lockupMark} /><span>Devista</span></div>
            </div>
            <div className={styles.reverseCard}>
              <span className={styles.cardLabel}>04 / Reverse on dark</span>
              <div className={styles.reverseContent}><Mark className={styles.reverseMark} /><span>Built to work in one colour.</span></div>
            </div>
          </div>
        </div>

        <div className={styles.scalePanel}>
          <div className={styles.scaleIntro}>
            <span className={styles.cardLabel}>Size check</span>
            <h2>From icon to identity.</h2>
            <p>One shape, tested at common display sizes.</p>
          </div>
          <div className={styles.scaleGrid}>
            {[24, 32, 48, 96].map((size) => (
              <div className={styles.scaleSample} key={size}>
                <Mark className={styles.scaleMark} />
                <span>{size}px</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actionRow}>
          <p>Editable SVG with a transparent background and single-colour paths.</p>
          <a href={asset} download="circular-monogram.svg">Download the SVG <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </div>
  );
}
