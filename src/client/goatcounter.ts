import type {ClientModule} from '@docusaurus/types';

type Pageview = {path: string; title: string; referrer: string};
type GoatCounterWindow = Window & {goatcounter?: {count?: (pageview: Pageview) => void}};

let scriptLoaded: Promise<boolean> | undefined;

function loadScript(): Promise<boolean> {
  return (scriptLoaded ??= new Promise((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://gc.zgo.at/count.js';
    script.dataset.goatcounter = 'https://jpbourgeon.goatcounter.com/count';
    // Count the initial page and later routes through the same hook.
    script.dataset.goatcounterSettings = JSON.stringify({no_onload: true});
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.append(script);
  }));
}

export const onRouteDidUpdate: NonNullable<ClientModule['onRouteDidUpdate']> = ({
  location,
  previousLocation,
}) => {
  if (typeof window === 'undefined' || window.location.origin !== 'https://jpbourgeon.github.io') {
    return;
  }
  if (location.pathname === previousLocation?.pathname) {
    return;
  }

  const path = window.location.pathname + window.location.search;
  const referrer = previousLocation ? '' : document.referrer;
  const script = loadScript();
  // Docusaurus updates the document title on the next animation frame.
  window.requestAnimationFrame(() => {
    const title = document.title;
    void script.then((loaded) => {
      if (loaded) {
        (window as GoatCounterWindow).goatcounter?.count?.({path, title, referrer});
      }
    });
  });
};
