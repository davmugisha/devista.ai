'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpRight, Calculator, Clock3, RotateCcw } from 'lucide-react';
import { MagneticButtonLink } from '../MagneticButtonLink';
import { SectionHead } from '../Section';
import { CTA } from '@/lib/site';

type Currency = 'USD' | 'EUR' | 'GBP' | 'ZAR';

const EXAMPLE = { tasks: 200, minutes: 15, share: 40, hourlyCost: 35, monthlyCost: 500, currency: 'USD' as Currency };

function bounded(value: string, max: number) {
  return Math.min(max, Math.max(0, Number(value) || 0));
}

/** A planning model driven entirely by visitor inputs, never presented as measured savings. */
export function RoiCalculator() {
  const [tasks, setTasks] = useState(EXAMPLE.tasks);
  const [minutes, setMinutes] = useState(EXAMPLE.minutes);
  const [share, setShare] = useState(EXAMPLE.share);
  const [hourlyCost, setHourlyCost] = useState(EXAMPLE.hourlyCost);
  const [monthlyCost, setMonthlyCost] = useState(EXAMPLE.monthlyCost);
  const [currency, setCurrency] = useState<Currency>(EXAMPLE.currency);
  const reduceMotion = useReducedMotion();

  const hours = (tasks * minutes * (share / 100)) / 60;
  const annualValue = hours * hourlyCost * 12;
  const annualCost = monthlyCost * 12;
  const roi = annualCost > 0 ? ((annualValue - annualCost) / annualCost) * 100 : null;
  const money = new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });

  function reset() {
    setTasks(EXAMPLE.tasks);
    setMinutes(EXAMPLE.minutes);
    setShare(EXAMPLE.share);
    setHourlyCost(EXAMPLE.hourlyCost);
    setMonthlyCost(EXAMPLE.monthlyCost);
    setCurrency(EXAMPLE.currency);
  }

  return (
    <section id="roi" aria-labelledby="roi-title" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-page px-4 md:px-8">
        <SectionHead
          id="roi"
          chip="Estimate the opportunity"
          title="What could one workflow give back?"
          lede="Use your own task volume, time and costs to see a planning estimate. The audit checks these assumptions against the real workflow."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <div className="glass-tile p-6 md:p-8 lg:col-span-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-control border border-rule bg-panel/70 text-signal-bright">
                  <Calculator aria-hidden="true" className="size-5" />
                </span>
                <h3 className="text-xl font-display text-ink">Your assumptions</h3>
              </div>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 rounded-control px-2 py-2 text-sm text-graphite hover:text-ink">
                <RotateCcw aria-hidden="true" className="size-4" /> Reset
              </button>
            </div>
            <p className="mt-3 text-sm text-graphite">Example values are prefilled. Change them to match one workflow.</p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-ink">
                Tasks each month
                <input className="roi-input mt-2" type="number" inputMode="numeric" min="0" max="100000" value={tasks} onChange={(e) => setTasks(bounded(e.target.value, 100000))} />
              </label>
              <label className="block text-sm font-medium text-ink">
                Minutes per task
                <input className="roi-input mt-2" type="number" inputMode="decimal" min="0" max="1440" value={minutes} onChange={(e) => setMinutes(bounded(e.target.value, 1440))} />
              </label>
              <label className="block text-sm font-medium text-ink">
                Loaded hourly cost
                <input className="roi-input mt-2" type="number" inputMode="decimal" min="0" max="100000" value={hourlyCost} onChange={(e) => setHourlyCost(bounded(e.target.value, 100000))} />
              </label>
              <label className="block text-sm font-medium text-ink">
                Estimated monthly spend
                <input className="roi-input mt-2" type="number" inputMode="decimal" min="0" max="10000000" value={monthlyCost} onChange={(e) => setMonthlyCost(bounded(e.target.value, 10000000))} />
              </label>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-3 text-sm font-medium text-ink">
                <label htmlFor="roi-share">Share of task time recoverable</label>
                <output htmlFor="roi-share" className="tabular text-signal-bright">{share}%</output>
              </div>
              <input id="roi-share" className="roi-range mt-3 w-full" type="range" min="0" max="100" step="5" value={share} onChange={(e) => setShare(Number(e.target.value))} />
              <div className="mt-1 flex justify-between text-xs text-slate"><span>0%</span><span>100%</span></div>
            </div>
            <label className="mt-6 block text-sm font-medium text-ink">
              Currency for your inputs
              <select className="roi-input mt-2" value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="ZAR">ZAR</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            <div className="glass-tile glass-tile-lit flex flex-col p-7 sm:col-span-2 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-wide text-signal-bright">Capacity returned</span>
                <Clock3 aria-hidden="true" className="size-5 text-signal-bright" />
              </div>
              <div aria-live="polite" aria-atomic="true" className="mt-auto pt-12">
                <p className="tabular text-5xl font-display tracking-display text-ink">{number.format(hours)} <span className="text-xl text-graphite">hours / month</span></p>
                <p className="mt-3 text-sm text-graphite">Based on {number.format(tasks * minutes / 60)} hours spent on these tasks each month.</p>
              </div>
              <div className="mt-7 h-2 overflow-hidden rounded-dot bg-panel">
                <motion.div className="h-full rounded-dot bg-signal" initial={false} animate={{ width: `${share}%` }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 24 }} />
              </div>
            </div>
            <div className="glass-tile flex flex-col p-7">
              <span className="font-mono text-xs uppercase tracking-wide text-slate">Annual capacity value</span>
              <p className="tabular mt-auto pt-10 text-3xl font-display tracking-display text-ink">{money.format(annualValue)}</p>
              <p className="mt-2 text-sm text-graphite">Recovered hours × loaded hourly cost × 12.</p>
            </div>
            <div className="glass-tile flex flex-col p-7">
              <span className="flex items-center justify-between font-mono text-xs uppercase tracking-wide text-slate">Modeled return <ArrowUpRight aria-hidden="true" className="size-4" /></span>
              <p className="tabular mt-auto pt-10 text-3xl font-display tracking-display text-ink">{roi === null ? '—' : `${number.format(roi)}%`}</p>
              <p className="mt-2 text-sm text-graphite">{roi === null ? 'Add a monthly spend to calculate return.' : 'Annual capacity value after estimated spend, divided by spend.'}</p>
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <p className="max-w-measure text-sm text-graphite">Illustrative estimate only. Returned time is capacity, not guaranteed cash savings. Actual scope, recovery and fees are established during the free audit.</p>
          <MagneticButtonLink href={CTA.book.href} track="roi" className="shrink-0">{CTA.book.label}</MagneticButtonLink>
        </div>
      </div>
    </section>
  );
}
