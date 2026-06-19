// Hardcoded Madrid coordinates for map display
// TODO: eventually add coords field to WP activity post type

export interface ActivityCoords {
  lat: number;
  lng: number;
  address?: string;
}

const COORDS_BY_TITLE: Record<string, ActivityCoords> = {
  'flamenco':               { lat: 40.4153, lng: -3.7059, address: 'Tablao Flamenco, Madrid Centro' },
  'flamenco show':          { lat: 40.4153, lng: -3.7059, address: 'Tablao Villa Rosa, Madrid' },
  'mercado de san miguel':  { lat: 40.4150, lng: -3.7092, address: 'Plaza de San Miguel, s/n' },
  'prado':                  { lat: 40.4138, lng: -3.6921, address: 'Paseo del Prado, 28014 Madrid' },
  'prado museum':           { lat: 40.4138, lng: -3.6921, address: 'Paseo del Prado, 28014 Madrid' },
  'rastro':                 { lat: 40.4083, lng: -3.7095, address: 'La Ribera de Curtidores, Embajadores' },
  'el rastro':              { lat: 40.4083, lng: -3.7095, address: 'La Ribera de Curtidores, Embajadores' },
  'reina sofia':            { lat: 40.4079, lng: -3.6941, address: 'Calle de Santa Isabel, 52' },
  'apetito':                { lat: 40.4225, lng: -3.7003, address: 'Calle de Fuencarral, Malasaña' },
  'apetito kours':          { lat: 40.4225, lng: -3.7003, address: 'Calle de Fuencarral, Malasaña' },
  'billard':                { lat: 40.4185, lng: -3.7021, address: 'Gran Vía, Madrid Centro' },
  'bowling':                { lat: 40.4534, lng: -3.6900, address: 'Estación de Chamartín, s/n' },
  'bowling night':          { lat: 40.4534, lng: -3.6900, address: 'Bowling Chamartín, 28036 Madrid' },
  'kino':                   { lat: 40.4171, lng: -3.7035, address: 'Cine Callao, Gran Vía, 3' },
  'cinema':                 { lat: 40.4171, lng: -3.7035, address: 'Cine Callao, Gran Vía, 3' },
  'party':                  { lat: 40.4197, lng: -3.7060, address: 'Malasaña, 28004 Madrid' },
  'retiro':                 { lat: 40.4153, lng: -3.6844, address: 'Parque del Retiro, 28009 Madrid' },
  'retiro park':            { lat: 40.4153, lng: -3.6844, address: 'Parque del Retiro, 28009 Madrid' },
  'rooftop':                { lat: 40.4197, lng: -3.7024, address: 'Gran Vía rooftop bar, Madrid Centro' },
  'escape room':            { lat: 40.4175, lng: -3.7036, address: 'Centro Madrid' },
  'scape room':             { lat: 40.4175, lng: -3.7036, address: 'Centro Madrid' },
  'churros':                { lat: 40.4152, lng: -3.7073, address: 'Chocolatería San Ginés, Pasadizo San Ginés, 5' },
  'tapas':                  { lat: 40.4271, lng: -3.7021, address: 'Malasaña — Casa Baranda, Espíritu Santo, 40' },
  'tapas tour':             { lat: 40.4271, lng: -3.7021, address: 'Malasaña tapas route start' },
  'bernabeu':               { lat: 40.4531, lng: -3.6883, address: 'Av. de Concha Espina, 1, Chamartín' },
  'malasaña':               { lat: 40.4270, lng: -3.7039, address: 'Plaza del Dos de Mayo, Malasaña' },
  'segovia':                { lat: 40.9429, lng: -4.1088, address: 'Segovia city center (day trip)' },
  'toledo':                 { lat: 39.8628, lng: -4.0273, address: 'Toledo city center (day trip)' },
  'chueca':                 { lat: 40.4231, lng: -3.6974, address: 'Plaza de Chueca, Madrid' },
};

const FALLBACK_BY_CATEGORY: Record<string, ActivityCoords> = {
  flamenco:          { lat: 40.4153, lng: -3.7059 },
  museum:            { lat: 40.4138, lng: -3.6921 },
  city_tour:         { lat: 40.4168, lng: -3.7038 },
  football:          { lat: 40.4531, lng: -3.6883 },
  cooking_class:     { lat: 40.4225, lng: -3.7003 },
  tardeo:            { lat: 40.4197, lng: -3.7024 },
  language_exchange: { lat: 40.4168, lng: -3.7038 },
  day_trip:          { lat: 40.4153, lng: -3.6844 },
};

export function getActivityCoords(title: string, category?: string): ActivityCoords {
  const key = title.toLowerCase().trim();
  if (COORDS_BY_TITLE[key]) return COORDS_BY_TITLE[key];
  for (const [k, v] of Object.entries(COORDS_BY_TITLE)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  if (category && FALLBACK_BY_CATEGORY[category]) return FALLBACK_BY_CATEGORY[category];
  return { lat: 40.4168, lng: -3.7038 };
}
