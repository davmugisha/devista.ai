import { Briefcase, ChartColumn, Receipt, Target, type LucideIcon } from 'lucide-react';
import type { AGENT_TEAM } from '@/lib/content';

/** One icon per part of the agency in AGENT_TEAM (lib/content.ts). */
export const TEAM_ICONS: Record<(typeof AGENT_TEAM)[number]['id'], LucideIcon> = {
  'new-business': Target,
  'client-work': Briefcase,
  reporting: ChartColumn,
  admin: Receipt,
};
