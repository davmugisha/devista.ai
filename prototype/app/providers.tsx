'use client';

import { RouterProvider, Toast } from '@heroui/react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { PrototypeProvider } from '@/lib/store';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

/** HeroUI links (ListBox, Dropdown and Breadcrumbs items with href) navigate with the Next router. */
export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <RouterProvider navigate={(href, options) => router.push(href, options)}>
      <PrototypeProvider>
        {children}
        <Toast.Provider placement="bottom" />
      </PrototypeProvider>
    </RouterProvider>
  );
}
