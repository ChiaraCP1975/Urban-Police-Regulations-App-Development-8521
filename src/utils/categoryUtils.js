/**
 * Utility per la gestione coerente delle categorie in tutta l'applicazione
 */

// Mappa standardizzata delle categorie
export const CATEGORY_MAP = {
  'SICUREZZA URBANA E PUBBLICA INCOLUMITA\'': 'red',
  'CONVIVENZA CIVILE': 'emerald',
  'VIVIBILITA\'': 'blue',
  'IGIENE E PUBBLICO DECORO': 'teal',
  'QUIETE PUBBLICA E TRANQUILLITA\' DELLE PERSONE': 'purple',
  'MESTIERI,ATTIVITA\' LAVORATIVE E MANIFESTAZIONI': 'orange',
  'SICUREZZA E DEGRADO AMBIENTALE IN AMBITO RURALE': 'amber',
  'MANTENIMENTO DI TERRENI,FOSSI,ALBERI,PIANTE E ARBUSTI': 'lime',
  'GESTIONE DELLE ACQUE PIOVANE ED IRRIGUE': 'cyan',
  'PASCOLO E CONDUZIONE DI BESTIAME': 'green',
  'RISPETTO DEI BENI PRIVATI,COMUNALI,DEMANIALI': 'indigo'
};

// Elenco categorie formattato per select
export const CATEGORIES = [
  { value: 'SICUREZZA URBANA E PUBBLICA INCOLUMITA\'', label: 'Sicurezza Urbana e Pubblica Incolumità', color: 'red' },
  { value: 'CONVIVENZA CIVILE', label: 'Convivenza Civile', color: 'emerald' },
  { value: 'VIVIBILITA\'', label: 'Vivibilità', color: 'blue' },
  { value: 'IGIENE E PUBBLICO DECORO', label: 'Igiene e Pubblico Decoro', color: 'teal' },
  { value: 'QUIETE PUBBLICA E TRANQUILLITA\' DELLE PERSONE', label: 'Quiete Pubblica e Tranquillità', color: 'purple' },
  { value: 'MESTIERI,ATTIVITA\' LAVORATIVE E MANIFESTAZIONI', label: 'Mestieri, Attività Lavorative e Manifestazioni', color: 'orange' },
  { value: 'SICUREZZA E DEGRADO AMBIENTALE IN AMBITO RURALE', label: 'Sicurezza e Degrado Ambientale Rurale', color: 'amber' },
  { value: 'MANTENIMENTO DI TERRENI,FOSSI,ALBERI,PIANTE E ARBUSTI', label: 'Mantenimento Terreni, Fossi, Alberi e Piante', color: 'lime' },
  { value: 'GESTIONE DELLE ACQUE PIOVANE ED IRRIGUE', label: 'Gestione delle Acque Piovane ed Irrigue', color: 'cyan' },
  { value: 'PASCOLO E CONDUZIONE DI BESTIAME', label: 'Pascolo e Conduzione di Bestiame', color: 'green' },
  { value: 'RISPETTO DEI BENI PRIVATI,COMUNALI,DEMANIALI', label: 'Rispetto dei Beni Privati, Comunali, Demaniali', color: 'indigo' }
];

// Versione con etichette abbreviate per il menu di ricerca
export const CATEGORIES_SEARCH = [
  { value: 'Tutte', label: 'Tutte le categorie', color: 'gray' },
  { value: 'SICUREZZA URBANA E PUBBLICA INCOLUMITA\'', label: 'Sicurezza Urbana', color: 'red' },
  { value: 'CONVIVENZA CIVILE', label: 'Convivenza Civile', color: 'emerald' },
  { value: 'VIVIBILITA\'', label: 'Vivibilità', color: 'blue' },
  { value: 'IGIENE E PUBBLICO DECORO', label: 'Igiene e Decoro', color: 'teal' },
  { value: 'QUIETE PUBBLICA E TRANQUILLITA\' DELLE PERSONE', label: 'Quiete Pubblica', color: 'purple' },
  { value: 'MESTIERI,ATTIVITA\' LAVORATIVE E MANIFESTAZIONI', label: 'Mestieri e Attività', color: 'orange' },
  { value: 'SICUREZZA E DEGRADO AMBIENTALE IN AMBITO RURALE', label: 'Sicurezza Ambientale', color: 'amber' },
  { value: 'MANTENIMENTO DI TERRENI,FOSSI,ALBERI,PIANTE E ARBUSTI', label: 'Mantenimento Terreni', color: 'lime' },
  { value: 'GESTIONE DELLE ACQUE PIOVANE ED IRRIGUE', label: 'Gestione Acque', color: 'cyan' },
  { value: 'PASCOLO E CONDUZIONE DI BESTIAME', label: 'Pascolo e Bestiame', color: 'green' },
  { value: 'RISPETTO DEI BENI PRIVATI,COMUNALI,DEMANIALI', label: 'Rispetto dei Beni', color: 'indigo' }
];

/**
 * Ottiene il colore associato a una categoria
 * @param {string} categoria - Categoria da convertire in colore
 * @return {string} - Nome del colore (es. 'red', 'blue', ecc.)
 */
export const getCategoryColor = (categoria) => {
  if (!categoria) return 'slate';
  
  // Cerca prima una corrispondenza esatta
  if (CATEGORY_MAP[categoria]) {
    return CATEGORY_MAP[categoria];
  }
  
  // Se non trova corrispondenza esatta, cerca per parole chiave
  const normalizedCategory = categoria.toLowerCase();
  
  if (normalizedCategory.includes('mestieri') || normalizedCategory.includes('attivita') || normalizedCategory.includes('lavorative')) {
    return 'orange';
  }
  if (normalizedCategory.includes('mantenimento') || normalizedCategory.includes('terreni') || normalizedCategory.includes('fossi')) {
    return 'lime';
  }
  if (normalizedCategory.includes('rispetto') || normalizedCategory.includes('beni')) {
    return 'indigo';
  }
  if (normalizedCategory.includes('sicurezza') && normalizedCategory.includes('urbana')) {
    return 'red';
  }
  if (normalizedCategory.includes('convivenza')) {
    return 'emerald';
  }
  if (normalizedCategory.includes('vivibilita')) {
    return 'blue';
  }
  if (normalizedCategory.includes('igiene') || normalizedCategory.includes('decoro')) {
    return 'teal';
  }
  if (normalizedCategory.includes('quiete') || normalizedCategory.includes('tranquillita')) {
    return 'purple';
  }
  if (normalizedCategory.includes('ambientale') || normalizedCategory.includes('rurale')) {
    return 'amber';
  }
  if (normalizedCategory.includes('acque') || normalizedCategory.includes('piovane')) {
    return 'cyan';
  }
  if (normalizedCategory.includes('pascolo') || normalizedCategory.includes('bestiame')) {
    return 'green';
  }
  
  return 'slate';
};

/**
 * Restituisce le classi CSS per i badge delle categorie
 * @param {string} color - Nome del colore
 * @return {string} - Classi tailwind per il badge
 */
export const getCategoryBadgeClasses = (color) => {
  const colorMap = {
    'red': 'bg-red-100 text-red-700 border-red-300',
    'emerald': 'bg-emerald-100 text-emerald-700 border-emerald-300',
    'blue': 'bg-blue-100 text-blue-700 border-blue-300',
    'teal': 'bg-teal-100 text-teal-700 border-teal-300',
    'purple': 'bg-purple-100 text-purple-700 border-purple-300',
    'orange': 'bg-orange-100 text-orange-700 border-orange-300',
    'amber': 'bg-amber-100 text-amber-700 border-amber-300',
    'lime': 'bg-lime-100 text-lime-700 border-lime-300',
    'cyan': 'bg-cyan-100 text-cyan-700 border-cyan-300',
    'green': 'bg-green-100 text-green-700 border-green-300',
    'indigo': 'bg-indigo-100 text-indigo-700 border-indigo-300',
    'slate': 'bg-slate-100 text-slate-700 border-slate-300',
    'gray': 'bg-gray-100 text-gray-700 border-gray-300'
  };
  
  return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-300';
};

/**
 * Restituisce il colore del testo per le opzioni del menu
 * @param {string} color - Nome del colore
 * @return {string} - Classe tailwind per il colore del testo
 */
export const getTextColorClass = (color) => {
  const colorMap = {
    'red': 'text-red-700',
    'emerald': 'text-emerald-700',
    'blue': 'text-blue-700',
    'teal': 'text-teal-700',
    'purple': 'text-purple-700',
    'orange': 'text-orange-700',
    'amber': 'text-amber-700',
    'lime': 'text-lime-700',
    'cyan': 'text-cyan-700',
    'green': 'text-green-700',
    'indigo': 'text-indigo-700',
    'gray': 'text-gray-700',
    'slate': 'text-slate-700'
  };
  
  return colorMap[color] || 'text-gray-700';
};