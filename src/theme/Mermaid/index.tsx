import {useEffect, useMemo, useRef} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import {ErrorBoundaryErrorMessageFallback, useColorMode} from '@docusaurus/theme-common';
import {useMermaidConfig, useMermaidRenderResult} from '@docusaurus/theme-mermaid/client';
import type {Props} from '@theme/Mermaid';

function Diagram({value}: Props) {
  const {colorMode} = useColorMode();
  const options = useMermaidConfig();
  const container = useRef<HTMLDivElement>(null);
  const config = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    const color = (name: string) => styles.getPropertyValue(name).trim();
    const text = color('--ifm-font-color-base');
    const primary = color('--ifm-color-primary');
    const fill = color('--editorial-figure-fill');
    const alternate = color('--editorial-figure-alt');
    const line = color('--ifm-color-emphasis-700');

    return {
      ...options,
      theme: 'base' as const,
      themeVariables: {
        ...options.themeVariables,
        darkMode: colorMode === 'dark',
        fontFamily: color('--ifm-font-family-base'),
        background: color('--ifm-background-color'),
        textColor: text,
        primaryColor: fill,
        primaryTextColor: text,
        primaryBorderColor: primary,
        secondaryColor: alternate,
        secondaryTextColor: text,
        secondaryBorderColor: primary,
        tertiaryColor: alternate,
        tertiaryTextColor: text,
        tertiaryBorderColor: primary,
        lineColor: line,
        edgeLabelBackground: color('--ifm-background-color'),
        actorBkg: fill,
        actorBorder: primary,
        actorTextColor: text,
        actorLineColor: line,
        signalColor: line,
        signalTextColor: text,
        noteBkgColor: alternate,
        noteBorderColor: primary,
        noteTextColor: text,
        pie1: color('--editorial-series-1'),
        pie2: color('--editorial-series-2'),
        pie3: color('--editorial-series-3'),
        pie4: color('--editorial-series-4'),
        pie5: color('--editorial-series-5'),
        pieSectionTextColor: color('--editorial-series-label'),
        pieTitleTextColor: text,
        pieLegendTextColor: text,
        pieStrokeColor: color('--ifm-background-color'),
        pieOuterStrokeColor: primary,
        pieOpacity: 1,
      },
    };
  }, [options, colorMode]);
  const result = useMermaidRenderResult({text: value, config});

  useEffect(() => {
    if (result && container.current) result.bindFunctions?.(container.current);
  }, [result]);

  return result && (
    <div
      ref={container}
      className="docusaurus-mermaid-container"
      dangerouslySetInnerHTML={{__html: result.svg}}
    />
  );
}

export default function Mermaid(props: Props) {
  return (
    <ErrorBoundary fallback={(params) => <ErrorBoundaryErrorMessageFallback {...params} />}>
      <BrowserOnly>{() => <Diagram {...props} />}</BrowserOnly>
    </ErrorBoundary>
  );
}
