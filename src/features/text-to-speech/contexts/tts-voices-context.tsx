'use client';

import type { AppRouter } from '@/trpc/routers/_app';
import type { inferRouterOutputs } from '@trpc/server';
import { createContext, useContext } from 'react';

type GetAllOutput = Exclude<inferRouterOutputs<AppRouter>['voices']['getAll'], Response>;
type TTSVoiceItem = GetAllOutput['custom'][number];

interface TTSVoicesContextValue {
  customVoices: TTSVoiceItem[];
  systemVoices: TTSVoiceItem[];
  allVoices: TTSVoiceItem[];
}

const TTSVoicesContext = createContext<TTSVoicesContextValue | null>(null);

export function TTSVoicesProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TTSVoicesContextValue;
}) {
  return <TTSVoicesContext.Provider value={value}>{children}</TTSVoicesContext.Provider>;
}

export function useTTSVoices() {
  const context = useContext(TTSVoicesContext);

  if (!context) {
    throw new Error('useTTSVoices must be used within a TTSVoicesProvider');
  }

  return context;
}
