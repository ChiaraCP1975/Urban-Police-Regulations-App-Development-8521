import { createClient } from '@supabase/supabase-js'

// Credenziali di Supabase - Valori aggiornati
const SUPABASE_URL = 'https://qwvykgutfyjikceililu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3dnlrZ3V0ZnlqaWtjZWlsaWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg5ODA0NDAsImV4cCI6MjAzNDU1NjQ0MH0.5h_1hLLhQQjFEKlun0RcBMGQfAcn2yNJdG6XWkJA3_E'

// Verifica delle credenziali
if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  console.error('Credenziali Supabase mancanti o non valide');
}

// Creazione del client con opzioni avanzate per la gestione sessione
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  },
  realtime: {
    timeout: 60000
  }
})

// Log dell'inizializzazione
console.log('Client Supabase inizializzato con URL:', SUPABASE_URL);

// Funzione di verifica della connessione che può essere chiamata esplicitamente
export const testConnection = async () => {
  try {
    console.log('Tentativo di connessione a Supabase...');
    const { data, error } = await supabase
      .from('sanzioni_violations')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error) {
      console.error('Errore di connessione a Supabase:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('Connessione a Supabase stabilita con successo');
    return { success: true };
  } catch (err) {
    console.error('Eccezione durante la connessione a Supabase:', err.message);
    return { success: false, error: err.message };
  }
};

// Esegui test di connessione all'avvio
testConnection();

export default supabase;