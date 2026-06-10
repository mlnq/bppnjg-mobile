import type { Href, Router } from 'expo-router';

export function goBackOrReplace(router: Pick<Router, 'canGoBack' | 'back' | 'replace'>, href: Href) {
  if (router.canGoBack()) {
    router.back();
    return;
  }

  router.replace(href);
}
