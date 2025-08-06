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

// Esponi l'URL e la chiave per l'utilizzo diretto nelle funzioni API
supabase.supabaseUrl = SUPABASE_URL;
supabase.supabaseKey = SUPABASE_ANON_KEY;

// Log dell'inizializzazione
console.log('Client Supabase inizializzato con URL:', SUPABASE_URL);

// Funzione per creare la tabella se non esiste
export const createSanzioniTable = async () => {
  try {
    console.log('Tentativo di creazione tabella sanzioni_violations...');
    
    // Approccio diretto SQL
    const { data, error } = await supabase.from('sanzioni_violations').select('count(*)', { count: 'exact', head: true });
    
    if (!error) {
      console.log('La tabella esiste già');
      return { success: true, exists: true };
    }
    
    // Crea la tabella direttamente
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS sanzioni_violations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        articolo TEXT NOT NULL,
        comma TEXT,
        categoria TEXT,
        descrizione TEXT NOT NULL,
        pmr NUMERIC(10,2),
        sanzioni_accessorie TEXT,
        altro TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      ALTER TABLE sanzioni_violations ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all operations" ON sanzioni_violations;
      CREATE POLICY "Allow all operations" ON sanzioni_violations FOR ALL USING (true) WITH CHECK (true);
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
      console.error('Errore nella creazione della tabella:', createError);
      return { success: false, error: createError };
    }
    
    // Inserisci dati di esempio se la tabella è vuota
    const { data: count, error: countError } = await supabase
      .from('sanzioni_violations')
      .select('count(*)', { count: 'exact', head: true });
      
    if (!countError && count === 0) {
      // Inserisci alcuni dati di esempio
      const exampleData = [
        {
          articolo: 'Art. 7',
          comma: '1',
          categoria: 'CONVIVENZA CIVILE',
          descrizione: 'Mancato rispetto delle norme di convivenza civile',
          pmr: 50.00,
          sanzioni_accessorie: 'Nessuna',
          altro: ''
        },
        {
          articolo: 'Art. 12',
          comma: '3',
          categoria: 'IGIENE E PUBBLICO DECORO',
          descrizione: 'Abbandono di rifiuti su suolo pubblico',
          pmr: 150.00,
          sanzioni_accessorie: 'Obbligo di pulizia dell\'area',
          altro: 'Recidiva: sanzione raddoppiata'
        }
      ];
      
      const { error: insertError } = await supabase
        .from('sanzioni_violations')
        .insert(exampleData);
        
      if (insertError) {
        console.error('Errore nell\'inserimento dei dati di esempio:', insertError);
      }
    }
    
    return { success: true };
  } catch (err) {
    console.error('Eccezione durante la creazione della tabella:', err);
    return { success: false, error: err.message };
  }
};

// Funzione di verifica della connessione che può essere chiamata esplicitamente
export const testConnection = async () => {
  try {
    console.log('Tentativo di connessione a Supabase...');
    
    // Approccio diretto
    const { data, error } = await supabase
      .from('sanzioni_violations')
      .select('count(*)', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      // Tabella non esiste, ma la connessione funziona
      console.log('Connessione a Supabase stabilita, ma la tabella non esiste');
      
      // Tenta di creare la tabella
      const createResult = await createSanzioniTable();
      if (createResult.success) {
        return { success: true, tableCreated: true };
      } else {
        return { success: true, tableExists: false, createError: createResult.error };
      }
    } else if (error) {
      console.error('Errore di connessione a Supabase:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('Connessione a Supabase stabilita con successo');
    return { success: true, tableExists: true };
  } catch (err) {
    console.error('Eccezione durante la connessione a Supabase:', err.message);
    return { success: false, error: err.message };
  }
};

// Esegui test di connessione all'avvio
testConnection().then(result => {
  if (result.success) {
    console.log('Connessione a Supabase verificata con successo');
    if (result.tableCreated) {
      console.log('La tabella sanzioni_violations è stata creata');
    }
  } else {
    console.error('Problema di connessione a Supabase:', result.error);
  }
});

export default supabase;