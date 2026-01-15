// components/RedirectDebugger.tsx
'use client'
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function RedirectDebugger() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log('📍 Current path:', pathname);
    
    // Log when redirects happen
    const originalPush = router.push;
    router.push = function(...args) {
      console.log('🔄 Redirect triggered:', {
        from: pathname,
        to: args[0],
        stack: new Error().stack
      });
      return originalPush.apply(this, args);
    };

    return () => {
      router.push = originalPush;
    };
  }, [pathname, router]);

  return null;
}