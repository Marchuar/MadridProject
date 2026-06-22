export interface ActivityCoords {
  lat: number;
  lng: number;
  address?: string;
}

const COORDS_BY_TITLE: Record<string, ActivityCoords> = {
  'flamenco':               { lat: 40.4153, lng: -3.7059, address: 'Tablao Flamenco, Madrid Centro' },
  'flamenco show':          { lat: 40.4153, lng: -3.7059, address: 'Tablao Villa Rosa, Madrid' },
  'flamenco evening':       { lat: 40.4137, lng: -3.6995, address: 'Tablao Flamenco 1911, Calle de los Madrazo 11' },
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
  'bernab':                 { lat: 40.4531, lng: -3.6883, address: 'Av. de Concha Espina, 1, Chamartín' },
  'stadium':                { lat: 40.4531, lng: -3.6883, address: 'Estadio Santiago Bernabéu' },
  'malasaña':               { lat: 40.4270, lng: -3.7039, address: 'Plaza del Dos de Mayo, Malasaña' },
  'segovia':                { lat: 40.9429, lng: -4.1088, address: 'Segovia city center (day trip)' },
  'toledo':                 { lat: 39.8628, lng: -4.0273, address: 'Toledo city center (day trip)' },
  'chueca':                 { lat: 40.4231, lng: -3.6974, address: 'Plaza de Chueca, Madrid' },
  'austrias':               { lat: 40.4155, lng: -3.7092, address: 'Madrid de los Austrias' },
  'historic':               { lat: 40.4155, lng: -3.7092, address: 'Madrid Historic Center' },
  'la latina':              { lat: 40.4107, lng: -3.7091, address: 'La Latina, Madrid' },
  'latina':                 { lat: 40.4107, lng: -3.7091, address: 'La Latina, Madrid' },
  'language exchange':      { lat: 40.4168, lng: -3.7038, address: 'Centro Madrid' },
  'language':               { lat: 40.4168, lng: -3.7038, address: 'Centro Madrid' },
  'cooking':                { lat: 40.4225, lng: -3.7003, address: 'Malasaña, Madrid' },
  'paella':                 { lat: 40.4225, lng: -3.7003, address: 'Malasaña, Madrid' },
  'day trip':               { lat: 40.4153, lng: -3.6844, address: 'Madrid (departure point)' },
  'walking tour':           { lat: 40.4168, lng: -3.7038, address: 'Plaza Mayor, Madrid' },
  'city tour':              { lat: 40.4168, lng: -3.7038, address: 'Plaza Mayor, Madrid' },
  'madrid tour':            { lat: 40.4168, lng: -3.7038, address: 'Plaza Mayor, Madrid' },
};

// Madrid district coordinates by postal code / neighbourhood keyword
const COORDS_BY_LOCATION: Record<string, ActivityCoords> = {
  '28001': { lat: 40.4200, lng: -3.6875 }, // Retiro
  '28002': { lat: 40.4437, lng: -3.6775 }, // Salamanca north
  '28003': { lat: 40.4371, lng: -3.7021 }, // Chamberí
  '28004': { lat: 40.4231, lng: -3.7001 }, // Centro/Chueca
  '28005': { lat: 40.4083, lng: -3.7116 }, // La Latina
  '28006': { lat: 40.4330, lng: -3.6836 }, // Salamanca
  '28007': { lat: 40.4083, lng: -3.6858 }, // Retiro sur
  '28008': { lat: 40.4247, lng: -3.7247 }, // Argüelles/Moncloa
  '28009': { lat: 40.4153, lng: -3.6844 }, // Retiro/Jeronimos
  '28010': { lat: 40.4321, lng: -3.7008 }, // Almagro/Chamberí
  '28011': { lat: 40.4075, lng: -3.7286 }, // Carabanchel
  '28012': { lat: 40.4089, lng: -3.7042 }, // Embajadores
  '28013': { lat: 40.4138, lng: -3.7132 }, // Palacio
  '28014': { lat: 40.4113, lng: -3.6929 }, // Cortes/Prado
  '28015': { lat: 40.4304, lng: -3.7089 }, // Chamberí
  '28016': { lat: 40.4631, lng: -3.6772 }, // Fuencarral
  '28017': { lat: 40.4020, lng: -3.6579 }, // Ciudad Lineal
  '28018': { lat: 40.3890, lng: -3.6620 }, // Vallecas
  '28019': { lat: 40.3769, lng: -3.7300 }, // Carabanchel sur
  '28020': { lat: 40.4526, lng: -3.7086 }, // Tetuán
  '28021': { lat: 40.3682, lng: -3.7241 }, // Orcasitas
  '28022': { lat: 40.4490, lng: -3.6330 }, // Hortaleza
  '28023': { lat: 40.4592, lng: -3.7782 }, // Aravaca
  '28024': { lat: 40.3654, lng: -3.7654 }, // Latina sur
  '28025': { lat: 40.3840, lng: -3.7466 }, // Carabanchel
  '28026': { lat: 40.3726, lng: -3.6836 }, // Usera/Vallecas
  '28027': { lat: 40.3965, lng: -3.6375 }, // Moratalaz
  '28028': { lat: 40.4188, lng: -3.6667 }, // Ciudad Lineal
  '28029': { lat: 40.4736, lng: -3.6434 }, // Hortaleza/Fuencarral
  '28030': { lat: 40.4082, lng: -3.6255 }, // Vicálvaro
  '28031': { lat: 40.3847, lng: -3.6246 }, // San Blas
  '28032': { lat: 40.3987, lng: -3.6079 }, // San Blas
  '28033': { lat: 40.4543, lng: -3.6367 }, // Hortaleza
  '28034': { lat: 40.4845, lng: -3.7007 }, // Fuencarral
  '28035': { lat: 40.4826, lng: -3.7292 }, // Peñagrande
  '28036': { lat: 40.4534, lng: -3.6900 }, // Chamartín
  '28037': { lat: 40.4354, lng: -3.6462 }, // Ciudad Lineal
  '28038': { lat: 40.3791, lng: -3.6472 }, // Vallecas
  '28039': { lat: 40.4745, lng: -3.6893 }, // Fuencarral
  '28040': { lat: 40.4468, lng: -3.7246 }, // Moncloa
  '28041': { lat: 40.3651, lng: -3.7040 }, // Usera
  '28042': { lat: 40.4700, lng: -3.6200 }, // Barajas
  '28043': { lat: 40.4530, lng: -3.6505 }, // Hortaleza
  '28044': { lat: 40.3743, lng: -3.7590 }, // Latina
  '28045': { lat: 40.4001, lng: -3.7033 }, // Arganzuela
  '28046': { lat: 40.4356, lng: -3.6933 }, // Salamanca/Recoletos
  '28047': { lat: 40.3875, lng: -3.7337 }, // Carabanchel
  '28048': { lat: 40.3450, lng: -3.8150 }, // Móstoles area
  '28049': { lat: 40.5085, lng: -3.7342 }, // Fuencarral norte
  '28050': { lat: 40.5040, lng: -3.6750 }, // Hortaleza norte
  // Neighbourhoods
  'hortaleza':    { lat: 40.4736, lng: -3.6434 },
  'fuencarral':   { lat: 40.4845, lng: -3.7007 },
  'chamartin':    { lat: 40.4534, lng: -3.6900 },
  'chamartín':    { lat: 40.4534, lng: -3.6900 },
  'tetuan':       { lat: 40.4526, lng: -3.7086 },
  'tetuán':       { lat: 40.4526, lng: -3.7086 },
  'chamberi':     { lat: 40.4321, lng: -3.7008 },
  'chamberí':     { lat: 40.4321, lng: -3.7008 },
  'salamanca':    { lat: 40.4330, lng: -3.6836 },
  'retiro':       { lat: 40.4153, lng: -3.6844 },
  'arganzuela':   { lat: 40.4001, lng: -3.7033 },
  'moncloa':      { lat: 40.4468, lng: -3.7246 },
  'centro':       { lat: 40.4168, lng: -3.7038 },
  'embajadores':  { lat: 40.4083, lng: -3.7095 },
  'lavapies':     { lat: 40.4089, lng: -3.7042 },
  'lavapiés':     { lat: 40.4089, lng: -3.7042 },
  'carabanchel':  { lat: 40.3840, lng: -3.7466 },
  'vallecas':     { lat: 40.3847, lng: -3.6246 },
  'usera':        { lat: 40.3901, lng: -3.7033 },
  'villaverde':   { lat: 40.3502, lng: -3.7121 },
  'barajas':      { lat: 40.4700, lng: -3.6200 },
  'vicálvaro':    { lat: 40.3987, lng: -3.6079 },
  'moratalaz':    { lat: 40.3965, lng: -3.6375 },
  'vallehermoso': { lat: 40.4371, lng: -3.7073 },
  'gran via':     { lat: 40.4200, lng: -3.7020 },
  'gran vía':     { lat: 40.4200, lng: -3.7020 },
  'sol':          { lat: 40.4168, lng: -3.7038 },
  'plaza mayor':  { lat: 40.4155, lng: -3.7074 },
  'cibeles':      { lat: 40.4193, lng: -3.6930 },
  'alcalá':       { lat: 40.4200, lng: -3.7000 },
  'paseo del prado': { lat: 40.4100, lng: -3.6920 },
  'atocha':       { lat: 40.4067, lng: -3.6897 },
  'arguelles':    { lat: 40.4247, lng: -3.7247 },
  'argüelles':    { lat: 40.4247, lng: -3.7247 },
  'pedro rico':   { lat: 40.4736, lng: -3.6434 }, // Hortaleza/Fuencarral area
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

// Try to extract coordinates from a location string using postal code or district keyword
function coordsFromLocation(location: string): ActivityCoords | null {
  const loc = location.toLowerCase();

  // Try postal code match (5 digits starting with 280 for Madrid)
  const postalMatch = loc.match(/\b(28\d{3})\b/);
  if (postalMatch && COORDS_BY_LOCATION[postalMatch[1]]) {
    return COORDS_BY_LOCATION[postalMatch[1]];
  }

  // Try neighbourhood / street keyword match
  for (const [keyword, coords] of Object.entries(COORDS_BY_LOCATION)) {
    if (!keyword.match(/^\d{5}$/) && loc.includes(keyword)) {
      return coords;
    }
  }

  return null;
}

export function getActivityCoords(title: string, category?: string, location?: string): ActivityCoords {
  const key = title.toLowerCase().trim();

  // 1. Exact title match
  if (COORDS_BY_TITLE[key]) return COORDS_BY_TITLE[key];

  // 2. Partial title match
  for (const [k, v] of Object.entries(COORDS_BY_TITLE)) {
    if (key.includes(k) || k.includes(key)) return v;
  }

  // 3. Location string (address / postal code / district)
  if (location) {
    const fromLocation = coordsFromLocation(location);
    if (fromLocation) return fromLocation;
  }

  // 4. Category fallback
  if (category && FALLBACK_BY_CATEGORY[category]) return FALLBACK_BY_CATEGORY[category];

  // 5. Center of Madrid
  return { lat: 40.4168, lng: -3.7038 };
}
