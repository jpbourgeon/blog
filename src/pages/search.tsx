import {useEffect} from 'react';
import React from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function SearchPage() {
  const {siteConfig} = useDocusaurusContext();
  // The shared index stores routes relative to the site root, including locale prefixes.
  const base = siteConfig.customFields?.pagefindBaseUrl as string;
  const bundle = base + 'pagefind/';
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
    <Layout title={translate({id: 'search.title', message: 'Rechercher'})}>
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
