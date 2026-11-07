import {useEffect} from 'react';
import React from 'react';
import Translate from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

export default function SearchPage() {
  const bundle = useBaseUrl('/pagefind/');
  const base = useBaseUrl('/');
  useEffect(() => {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = bundle + 'pagefind-component-ui.css';
    const script = document.createElement('script');
    script.type = 'module';
    script.src = bundle + 'pagefind-component-ui.js';
    document.head.append(stylesheet, script);
    return () => {stylesheet.remove(); script.remove();};
  }, [bundle]);

  return (
    <Layout title="Recherche">
      <main className="container margin-vert--lg">
        <h1><Translate id="search.title">Rechercher</Translate></h1>
        <p><Translate id="search.description">Rechercher dans les articles et les pages</Translate></p>
        {React.createElement('pagefind-config', {'base-url': base, 'bundle-path': bundle})}
        {React.createElement('pagefind-input', {})}
        {React.createElement('pagefind-summary', {})}
        {React.createElement('pagefind-results', {})}
      </main>
    </Layout>
  );
}
