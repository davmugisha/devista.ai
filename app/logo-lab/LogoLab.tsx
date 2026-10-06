'use client';

import { useState, type CSSProperties } from 'react';
import styles from './logo-lab.module.css';

type BrandKey = 'devista' | 'saydeed';

type Concept = {
  id: string;
  number: string;
  name: string;
  origin: 'Refined reference' | 'New concept';
  description: string;
  takeaway: string;
  asset: string;
};

const BRANDS: Record<BrandKey, { name: string; color: string; descriptor: string }> = {
  devista: { name: 'Devista', color: '#086B91', descriptor: 'Operating with clarity' },
  saydeed: { name: 'saydeed', color: '#0D3834', descriptor: 'Work, made clear' },
};

const CONCEPTS: Concept[] = [
  {
    id: 'geometric',
    number: '01',
    name: 'Geometric',
    origin: 'Refined reference',
    description: 'Three bold pieces, redrawn with even corners and cleaner spacing.',
    takeaway: 'The most architectural and distinctive silhouette.',
    asset: '/brand/concepts/reference-01-geometric.svg',
  },
  {
    id: 'monogram',
    number: '02',
    name: 'Circular letter',
    origin: 'Refined reference',
    description: 'An open ring around a clean angular letterform.',
    takeaway: 'A compact emblem that stays legible without a crossing slash.',
    asset: '/brand/concepts/reference-02-monogram.svg',
  },
  {
    id: 'ribbon',
    number: '03',
    name: 'Ribbon S',
    origin: 'Refined reference',
    description: 'Two angled ribbons rebuilt from the Saydeed reference.',
    takeaway: 'The clearest connection to the supplied Saydeed mark.',
    asset: '/brand/concepts/reference-03-saydeed.svg',
  },
  {
    id: 'relay',
    number: '04',
    name: 'Relay',
    origin: 'New concept',
    description: 'Two open paths meet in a continuous handoff.',
    takeaway: 'A softer, more collaborative direction.',
    asset: '/brand/concepts/new-01-relay.svg',
  },
  {
    id: 'prism',
    number: '05',
    name: 'Prism',
    origin: 'New concept',
    description: 'Three forward facets gather around a clear center.',
    takeaway: 'The most energetic mark for product surfaces.',
    asset: '/brand/concepts/new-02-prism.svg',
  },
];

function MarkGraphic({ asset, className = '' }: { asset: string; className?: string }) {
  const mask = `url("${asset}")`;
  return (
    <span
      aria-hidden="true"
      className={`${styles.mark} ${className}`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

export function LogoLab({ initialBrand }: { initialBrand: BrandKey }) {
  const [brandKey, setBrandKey] = useState<BrandKey>(initialBrand);
  const [selectedId, setSelectedId] = useState(CONCEPTS[0].id);
  const brand = BRANDS[brandKey];
  const selected = CONCEPTS.find((concept) => concept.id === selectedId) ?? CONCEPTS[0];

  return (
    <div className={styles.page} style={{ '--preview-color': brand.color } as CSSProperties}>
      <div className={styles.frame}>
        <header className={styles.intro}>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}><span className={styles.eyebrowDot} /> Brand exploration / October 2026</p>
            <h1>Which mark feels like <em>the one?</em></h1>
            <p className={styles.lede}>
              Your supplied visual references, refined into clean vectors, alongside two fresh directions.
              See every option as a full logo, a small icon, and in reverse before choosing.
            </p>
            <div className={styles.brandControl} role="group" aria-label="Preview wordmark">
              <span className={styles.controlLabel}>Preview as</span>
              <div className={styles.segmented}>
                {(Object.keys(BRANDS) as BrandKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={brandKey === key ? styles.segmentActive : styles.segment}
                    aria-pressed={brandKey === key}
                    onClick={() => setBrandKey(key)}
                  >
                    {key === 'devista' ? 'Devista' : 'Saydeed'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.heroPreview} aria-label={`${selected.name} logo preview for ${brand.name}`}>
            <div className={styles.heroPreviewGrid} aria-hidden="true" />
            <div className={styles.heroTopline}><span>Identity study</span><span>{selected.number} / 05</span></div>
            <div className={styles.heroIdentity}>
              <MarkGraphic asset={selected.asset} className={styles.heroMark} />
              <span className={styles.heroWordmark}>{brand.name}</span>
            </div>
            <div className={styles.heroBottomline}><span>{brand.descriptor}</span><span>2026</span></div>
          </div>
        </header>

        <section className={styles.collection} aria-labelledby="concepts-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>The shortlist</p>
              <h2 id="concepts-title">Five directions, side by side.</h2>
            </div>
            <p>Select a card to see it larger. Every mark is a downloadable SVG.</p>
          </div>

          <div className={styles.conceptGrid}>
            {CONCEPTS.map((concept) => {
              const active = concept.id === selectedId;
              return (
                <article key={concept.id} className={`${styles.card} ${active ? styles.cardActive : ''}`}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardNumber}>{concept.number}</span>
                    <span className={concept.origin === 'New concept' ? styles.newBadge : styles.refBadge}>
                      {concept.origin}
                    </span>
                  </div>
                  <div className={styles.cardArt}>
                    <MarkGraphic asset={concept.asset} className={styles.cardMark} />
                    <span className={styles.artCorner} aria-hidden="true">{concept.number} / 05</span>
                  </div>
                  <div className={styles.cardText}>
                    <h3>{concept.name}</h3>
                    <p>{concept.description}</p>
                  </div>
                  <div className={styles.cardLockup}>
                    <MarkGraphic asset={concept.asset} className={styles.lockupMark} />
                    <span>{brand.name}</span>
                  </div>
                  <div className={styles.cardChecks}>
                    <div className={styles.smallCheck}>
                      <span className={styles.checkLabel}>At 20px</span>
                      <MarkGraphic asset={concept.asset} className={styles.tinyMark} />
                    </div>
                    <div className={styles.reverseCheck}>
                      <span className={styles.checkLabel}>On dark</span>
                      <span className={styles.reverseTile}><MarkGraphic asset={concept.asset} className={styles.reverseMark} /></span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      className={active ? styles.pickActive : styles.pick}
                      aria-pressed={active}
                      onClick={() => setSelectedId(concept.id)}
                    >
                      {active ? 'Selected' : 'Select concept'}
                    </button>
                    <a href={concept.asset} download={`${concept.id}-mark.svg`} aria-label={`Download ${concept.name} SVG`} title={`Download ${concept.name} SVG`}>
                      SVG <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className={styles.decision} aria-labelledby="decision-title">
          <div className={styles.decisionCopy} aria-live="polite">
            <p className={styles.sectionKicker}>Your current pick</p>
            <h2 id="decision-title">{selected.name}</h2>
            <p>{selected.takeaway}</p>
            <span className={styles.decisionTag}>{selected.origin} · concept {selected.number}</span>
          </div>
          <div className={styles.decisionExamples}>
            <div className={styles.decisionLight}>
              <span className={styles.exampleLabel}>Primary lockup</span>
              <div className={styles.decisionLockup}>
                <MarkGraphic asset={selected.asset} className={styles.decisionMark} />
                <span>{brand.name}</span>
              </div>
            </div>
            <div className={styles.decisionDark}>
              <span className={styles.exampleLabel}>App icon</span>
              <div className={styles.appIcon}><MarkGraphic asset={selected.asset} className={styles.appMark} /></div>
            </div>
          </div>
        </section>

        <p className={styles.footnote}>These are design studies. The site’s current logo stays in place until you choose a direction.</p>
      </div>
    </div>
  );
}
