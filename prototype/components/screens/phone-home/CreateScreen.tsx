'use client';

// Create (Create.dc.html): a bottom sheet over the Brain Map. Say or type what you need and it goes
// to Chief of Staff, or start from one of the eight things you can make.

import { Description, Drawer, Form, InputGroup, Label, TextField, ToggleButton, cn } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { IconName } from '@/components/icons';
import { RoundLink } from '@/components/phone/RoundButton';
import { PhoneScreen } from '@/components/phone/PhoneFrame';
import { phone } from '@/lib/routes';
import { usePrototype } from '@/lib/store';
import { HomeScreen } from './HomeScreen';
import { FOCUS_RING, Glyph } from './PhoneChrome';
import { useRouteOverlay } from './overlay';

const TILES: { label: string; sub: string; icon: IconName; href: string }[] = [
  { label: 'New task', sub: 'For an agent or a person', icon: 'tasks', href: phone.section('tasks') },
  { label: 'Hire an agent', sub: 'From a role or a skill', icon: 'agent', href: phone.marketplace },
  { label: 'New goal', sub: 'All work traces to it', icon: 'goal', href: phone.section('goals') },
  { label: 'Group chat', sub: 'Agents and people', icon: 'group', href: phone.inbox('group') },
  { label: 'Schedule a call', sub: 'With any agent', icon: 'calendar', href: phone.call },
  { label: 'Add knowledge', sub: 'Docs, links, files', icon: 'fileUp', href: phone.section('knowledge') },
  { label: 'Marketplace', sub: 'Buy workflows, tools', icon: 'store', href: phone.marketplace },
  { label: 'Sell what you built', sub: 'List it on Marketplace', icon: 'tag', href: phone.sell },
];

const HELP = 'Chief of Staff sets it up and asks you before anything runs.';

export function CreateScreen() {
  const { open, onOpenChange, onCloseClick } = useRouteOverlay(phone.home);

  return (
    <PhoneScreen className="overflow-hidden leading-[normal]">
      <HomeScreen background />

      <Drawer.Backdrop isOpen={open} onOpenChange={onOpenChange} className="h-full">
        <Drawer.Content placement="bottom" className="h-full">
          <Drawer.Dialog className="max-h-[calc(100%-24px)] gap-4 rounded-t-[32px] bg-surface px-5 pt-3 pb-8 leading-[normal] text-foreground shadow-none">
            <Drawer.Handle className="pb-0 [&>[data-slot=drawer-handle-bar]]:h-[5px] [&>[data-slot=drawer-handle-bar]]:w-10 [&>[data-slot=drawer-handle-bar]]:rounded-full [&>[data-slot=drawer-handle-bar]]:bg-border" />
            <Drawer.Header className="flex-row items-center justify-between gap-3">
              <Drawer.Heading level={1} className="m-0 text-[24px] font-bold text-foreground">
                Create
              </Drawer.Heading>
              <RoundLink href={phone.home} label="Close" tone="inset" size={44} onClick={onCloseClick}>
                <Glyph name="close" size={20} />
              </RoundLink>
            </Drawer.Header>
            <Drawer.Body className="-my-[3px] flex flex-col gap-4 leading-[normal] text-foreground">
              <Prompt />
              <ul className="m-0 grid list-none grid-cols-2 gap-2.5 p-0">
                {TILES.map((t) => (
                  <li key={t.label} className="min-w-0">
                    <Link
                      href={t.href}
                      className={cn(
                        'flex h-full min-h-[88px] flex-col items-start justify-between rounded-[22px] bg-inset px-4 py-3.5 text-foreground transition-colors hover:bg-track hover:text-foreground',
                        FOCUS_RING,
                      )}
                    >
                      <Glyph name={t.icon} size={24} className="text-accent" />
                      <span className="flex min-w-0 flex-col gap-px">
                        <span className="text-[15px] font-bold">{t.label}</span>
                        <span className="text-[12px] font-semibold text-muted">{t.sub}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </PhoneScreen>
  );
}

/** What you need, typed or said. Sending it opens the conversation with Chief of Staff. */
function Prompt() {
  const router = useRouter();
  const { send } = usePrototype();
  const [text, setText] = useState('');
  const voice = useDictation(setText);

  return (
    <Form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const ask = text.trim();
        if (!ask) return;
        voice.stop();
        send('cos', ask);
        router.push(phone.chat);
      }}
    >
      <TextField
        value={text}
        onChange={(next) => {
          setText(next);
          voice.clearNote();
        }}
        className="flex flex-col gap-2"
        fullWidth
      >
        <Label className="sr-only">Describe what you need</Label>
        <InputGroup className="h-[60px] rounded-full border-border bg-inset pr-2 pl-[18px] shadow-none" fullWidth>
          <InputGroup.Input
            placeholder="Hire a bookkeeping agent under $200/mo"
            enterKeyHint="send"
            autoComplete="off"
            className="h-11 min-w-0 px-0 text-[15px] font-semibold text-foreground placeholder:text-muted sm:text-[15px]"
          />
          <InputGroup.Suffix className="border-0 bg-transparent p-0">
            <ToggleButton
              isIconOnly
              aria-label="Say it"
              isSelected={voice.listening}
              onChange={voice.toggle}
              className={cn(
                'size-11 min-w-11 rounded-full p-0',
                '[--toggle-button-bg:var(--accent-soft)] [--toggle-button-bg-hover:var(--accent-soft-hover)] [--toggle-button-bg-pressed:var(--accent-soft-hover)] [--toggle-button-fg:var(--accent)]',
                '[--toggle-button-bg-selected:var(--accent)] [--toggle-button-bg-selected-hover:var(--accent-hover)] [--toggle-button-bg-selected-pressed:var(--accent-hover)] [--toggle-button-fg-selected:var(--accent-foreground)]',
              )}
            >
              <Glyph name="mic" size={20} />
            </ToggleButton>
          </InputGroup.Suffix>
        </InputGroup>
        <Description aria-live="polite" className="px-[18px] text-[13px] font-semibold text-muted">
          {voice.note ?? HELP}
        </Description>
      </TextField>
    </Form>
  );
}

// The browser's speech recognition, where it has one (Chrome, Edge, Safari).
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type RecognitionConstructor = new () => Recognition;

/** Dictation into the prompt. Where the browser cannot listen, it says so and the field still works. */
function useDictation(setText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => () => rec.current?.stop(), []);

  const stop = () => {
    rec.current?.stop();
    setListening(false);
  };

  const start = () => {
    const w = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      setNote('This browser cannot listen. Type it instead.');
      return;
    }
    const r = new Ctor();
    r.lang = 'en';
    r.interimResults = true;
    r.continuous = false;
    r.onresult = (e) => {
      const said = Array.from(e.results, (result) => result[0]?.transcript ?? '').join('');
      setText(said);
    };
    r.onerror = (e) => {
      setNote(e.error === 'not-allowed' ? 'Microphone access is off. Type it instead.' : 'Didn’t catch that. Try again or type it.');
      setListening(false);
    };
    r.onend = () => {
      setListening(false);
      rec.current = null;
    };
    rec.current = r;
    setNote('Listening…');
    setListening(true);
    try {
      r.start();
    } catch {
      setListening(false);
      setNote('This browser cannot listen. Type it instead.');
    }
  };

  return {
    listening,
    note: listening ? 'Listening…' : note === 'Listening…' ? null : note,
    stop,
    clearNote: () => setNote(null),
    toggle: (on: boolean) => (on ? start() : stop()),
  };
}
