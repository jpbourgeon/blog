import assert from 'node:assert/strict';

type Audit = {
  runtimeError?: {message: string};
  finalDisplayedUrl: string;
  audits: Record<string, {score: number | null}>;
};

export function requireSuccessfulAudit(url: string, audit?: Audit): asserts audit is Audit {
  assert(audit && !audit.runtimeError,
    'Lighthouse could not audit ' + url + ': ' + audit?.runtimeError?.message);
  assert(audit.audits['http-status-code']?.score === 1 && audit.finalDisplayedUrl === url,
    'Expected a successful response from the local build at ' + url);
}
