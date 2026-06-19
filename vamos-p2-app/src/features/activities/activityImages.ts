// Maps activity titles / categories to extracted poster images
// Images live in public/activities/ as WebP files

const IMAGE_BY_TITLE: Record<string, string> = {
  'flamenco':                   '/activities/flamenco.webp',
  'flamenco show':              '/activities/flamenco.webp',
  'samstagsplan: flamenco-show': '/activities/flamenco.webp',
  'mercado de san miguel':      '/activities/mercado.webp',
  'prado':                      '/activities/prado.webp',
  'prado museum':               '/activities/prado.webp',
  'prado-museum':               '/activities/prado.webp',
  'rastro':                     '/activities/rastro.webp',
  'el rastro':                  '/activities/rastro.webp',
  'reina sofia':                '/activities/reina_sofia.webp',
  'museo reina sofía':          '/activities/reina_sofia.webp',
  'apetito':                    '/activities/apetito.webp',
  'apetito kours':              '/activities/apetito.webp',
  'cooking class':              '/activities/apetito.webp',
  'billard':                    '/activities/billard.webp',
  'billiards':                  '/activities/billard.webp',
  'billard und darts':          '/activities/billard.webp',
  'bowling':                    '/activities/bowling.webp',
  'bowling night':              '/activities/bowling.webp',
  'kino':                       '/activities/kino.webp',
  'cinema':                     '/activities/kino.webp',
  'movie night':                '/activities/kino.webp',
  'party':                      '/activities/party.webp',
  'night out':                  '/activities/party.webp',
  'retiro':                     '/activities/retiro.webp',
  'retiro park':                '/activities/retiro.webp',
  'rooftop':                    '/activities/rooftop.webp',
  'rooftop bar':                '/activities/rooftop.webp',
  'rooftop abend':              '/activities/rooftop.webp',
  'escape room':                '/activities/escape.webp',
  'scape room':                 '/activities/escape.webp',
  'churros':                    '/activities/churros.webp',
  'spaziergang & churros':      '/activities/churros.webp',
  'churros walk':               '/activities/churros.webp',
  'tapas':                      '/activities/tapas.webp',
  'tapas tour':                 '/activities/tapas.webp',
  'tour de tapas':              '/activities/tapas.webp',
  'bernabeu':                   '/activities/bernabeu.webp',
  'bernabéu':                   '/activities/bernabeu.webp',
  'bernabeu tour':              '/activities/bernabeu.webp',
  'malasaña':                   '/activities/malasana.webp',
  'malasana':                   '/activities/malasana.webp',
  'malasaña tour':              '/activities/malasana.webp',
  'segovia':                    '/activities/segovia.webp',
  'segovia tour':               '/activities/segovia.webp',
  'toledo':                     '/activities/toledo.webp',
  'toledo tour':                '/activities/toledo.webp',
  'chueca':                     '/activities/chueca.webp',
  'tour chueca y malasaña':     '/activities/chueca.webp',
};

const FALLBACK_BY_CATEGORY: Record<string, string> = {
  flamenco:          '/activities/flamenco.webp',
  museum:            '/activities/prado.webp',
  city_tour:         '/activities/malasana.webp',
  football:          '/activities/bernabeu.webp',
  cooking_class:     '/activities/tapas.webp',
  tardeo:            '/activities/rooftop.webp',
  language_exchange: '/activities/chueca.webp',
  day_trip:          '/activities/retiro.webp',
};

export function getActivityImage(title: string, category?: string, imageUrl?: string): string {
  if (imageUrl) return imageUrl;
  const key = title.toLowerCase().trim();
  if (IMAGE_BY_TITLE[key]) return IMAGE_BY_TITLE[key];
  // Partial match
  for (const [k, v] of Object.entries(IMAGE_BY_TITLE)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  if (category && FALLBACK_BY_CATEGORY[category]) return FALLBACK_BY_CATEGORY[category];
  return '/activities/retiro.webp';
}
