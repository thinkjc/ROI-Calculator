export type ClientConfig = {
  name: string;
  logoUrl?: string;
  locale: 'en-GB' | 'en-US';
  defaultCurrency: 'GBP' | 'EUR' | 'USD' | 'JPY';
};

// Keys are GUIDs — never use client names as keys.
// Generate a new UUID at e.g. uuidgenerator.net for each new client.
const CLIENTS: Record<string, ClientConfig> = {
  'a4f8e2c1-3b7d-4a9e-8f2c-5d1b6e9a3c7f': {
    name: 'VOIS',
    logoUrl: undefined,
    locale: 'en-GB',
    defaultCurrency: 'GBP',
  },
};

export function getClient(guid: string | null): ClientConfig | null {
  if (!guid) return null;
  return CLIENTS[guid] ?? null;
}

const BRITISH_TO_AMERICAN: [RegExp, string][] = [
  [/\borganisations\b/gi, 'organizations'],
  [/\borganisation\b/gi, 'organization'],
  [/\bprioritisation\b/gi, 'prioritization'],
  [/\bprioritised\b/gi, 'prioritized'],
  [/\bprioritise\b/gi, 'prioritize'],
  [/\brealisations\b/gi, 'realizations'],
  [/\brealisation\b/gi, 'realization'],
  [/\brealise\b/gi, 'realize'],
  [/\bbehaviours\b/gi, 'behaviors'],
  [/\bbehaviour\b/gi, 'behavior'],
  [/\banalyse\b/gi, 'analyze'],
  [/\boptimise\b/gi, 'optimize'],
  [/\bmaximise\b/gi, 'maximize'],
  [/\bcentres\b/gi, 'centers'],
  [/\bcentre\b/gi, 'center'],
  [/\blabour\b/gi, 'labor'],
  [/\bcolour\b/gi, 'color'],
  [/\bco-ordinating\b/gi, 'coordinating'],
  [/\bco-ordinated\b/gi, 'coordinated'],
];

export function localise(text: string, locale: 'en-GB' | 'en-US'): string {
  if (locale === 'en-GB') return text;
  return BRITISH_TO_AMERICAN.reduce(
    (t, [pattern, replacement]) => t.replace(pattern, replacement),
    text
  );
}
