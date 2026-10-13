'use client';

import { useState } from 'react';
import { UsersRound } from 'lucide-react';
import { delay, Section } from '../Section';
import { AGENT_TEAM } from '@/lib/content';
import { TEAM_ICONS } from './team-icons';

// Where each column's line lands, on a 1000 wide grid, for four equal columns.
const ENDS = [125, 375, 625, 875];

/**
 * The agency as an org chart: your team on top setting the rules, and agents under each part of
 * the agency. Picking a part marks it as the first workflow, which is how every setup starts.
 */
export function AgentTeam() {
  const [start, setStart] = useState(0);
  const chosen = AGENT_TEAM[start];

  return (
    <Section
      id="agent-team"
      chip="Your agent team"
      title="This is your agency with an agent team behind it."
      lede="Agents take the repeat work in each part of the agency. Your people set the rules and approve what goes out. Pick where you would start."
    >
      <div className="mt-14">
        <div data-reveal className="flex justify-center">
          <div className="card card-lit flex items-center gap-3 px-5 py-4">
            <span className="flex size-10 items-center justify-center rounded-control bg-ink">
              <UsersRound aria-hidden="true" className="size-5 text-paper" strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-base font-semibold text-ink">Your team</p>
              <p className="text-sm text-graphite">Sets the rules and approves what goes out</p>
            </div>
          </div>
        </div>

        <svg aria-hidden="true" viewBox="0 0 1000 64" preserveAspectRatio="none" className="hidden h-16 w-full lg:block">
          {ENDS.map((x, i) => (
            <path
              key={x}
              d={`M500 0 C500 40 ${x} 24 ${x} 64`}
              vectorEffect="non-scaling-stroke"
              strokeWidth={i === start ? 2 : 1}
              className={'fill-none transition-colors duration-300 ' + (i === start ? 'flow stroke-signal' : 'stroke-rule-strong/50')}
            />
          ))}
        </svg>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
          {AGENT_TEAM.map((part, i) => {
            const Icon = TEAM_ICONS[part.id];
            const on = i === start;
            return (
              <li key={part.id} data-reveal style={delay(i * 80)} className="relative">
                {on ? (
                  <span className="absolute -top-3 right-4 z-10 rounded-dot bg-signal px-3 py-px text-xs font-semibold text-on-signal shadow-float">Start here</span>
                ) : null}
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setStart(i)}
                  className={
                    'card flex w-full items-center gap-3 p-4 text-left transition-colors duration-300 ' +
                    (on ? 'card-lit border-signal' : 'hover:border-rule-strong')
                  }
                >
                  <span
                    className={
                      'flex size-10 shrink-0 items-center justify-center rounded-control border transition-colors duration-300 ' +
                      (on ? 'border-signal bg-signal text-on-signal' : 'border-rule bg-panel text-signal-bright')
                    }
                  >
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-ink">{part.name}</span>
                    <span className="block text-xs text-slate">{part.agents.length} example agents</span>
                  </span>
                </button>
                <ul className="mt-3 space-y-2">
                  {part.agents.map((agent) => (
                    <li
                      key={agent}
                      className={
                        'flex items-center justify-between gap-3 rounded-control border px-4 py-3 text-sm transition-colors duration-300 ' +
                        (on ? 'border-signal/40 bg-signal-tint text-ink' : 'border-rule bg-mist text-graphite')
                      }
                    >
                      {agent}
                      <span aria-hidden="true" className={'size-2 shrink-0 rounded-dot ' + (on ? 'bg-signal animate-blink' : 'bg-rule')} />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <p aria-live="polite" className="mx-auto mt-8 max-w-narrow text-center text-base text-ink">
          <span className="font-semibold">Start with {chosen.name.toLowerCase()}:</span> 3 to 5 of these agents on one workflow, installed in 7 days. More can follow
          once you have seen them work.
        </p>
        <p className="mt-3 text-center text-xs text-slate">Example agents for an agency. Your workflow and agents are agreed on the free call.</p>
      </div>
    </Section>
  );
}
