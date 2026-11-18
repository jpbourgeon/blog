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
        pie1: color('--ifm-color-primary-darkest'),
        pie2: color('--ifm-color-primary-dark'),
        pie3: primary,
        pie4: color('--ifm-color-primary-light'),
        pie5: color('--ifm-color-primary-lightest'),
        pieSectionTextColor: color('--editorial-figure-on-primary'),
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
