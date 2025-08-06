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

// Funzione per inserire dati di esempio
export const insertExampleData = async () => {
  try {
    // Verifica se ci sono già dati
    const { data, count, error: countError } = await supabase
      .from('sanzioni_violations')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Errore nel conteggio dei dati:', countError);
      return { success: false, error: countError };
    }
    
    // Se ci sono già dati, non inserire esempi
    if (count > 0) {
      console.log('Dati esistenti trovati, saltando inserimento esempi');
      return { success: true, skipped: true };
    }
    
    console.log('Inserimento dati di esempio...');
    
    // Inserisci dati di esempio
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
      return { success: false, error: insertError };
    }
    
    console.log('Dati di esempio inseriti con successo');
    return { success: true };
  } catch (err) {
    console.error('Errore durante l\'inserimento dei dati di esempio:', err);
    return { success: false, error: err.message };
  }
};

// Funzione per creare la tabella se non esiste
export const createSanzioniTable = async () => {
  try {
    console.log('Tentativo di creazione tabella sanzioni_violations...');
    
    // Verifica se la tabella esiste già
    const { data, error } = await supabase
      .from('sanzioni_violations')
      .select('count(*)', { count: 'exact', head: true })
      .limit(1);
    
    if (!error) {
      console.log('La tabella esiste già');
      return { success: true, exists: true };
    }
    
    // Se la tabella non esiste, creala direttamente con SQL
    console.log('La tabella non esiste, tentativo di creazione...');
    
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
    
    try {
      // Usa RPC
      const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
      
      if (createError) {
        console.warn('Errore nel metodo RPC:', createError.message);
        throw createError;
      }
      
      console.log('Tabella creata con successo tramite RPC');
      return { success: true, method: 'rpc' };
    } catch (rpcError) {
      console.warn('Fallito metodo RPC, tentativo alternativo...');
      
      try {
        // Metodo alternativo: esecuzione diretta SQL
        const { error: sqlError } = await supabase.from('sanzioni_violations').insert({
          articolo: 'Test',
          descrizione: 'Test'
        });
        
        if (!sqlError || sqlError.code !== '42P01') {
          console.log('Tabella creata o esistente');
          return { success: true, method: 'direct' };
        }
        
        throw new Error('Impossibile creare la tabella: ' + (sqlError?.message || 'Errore sconosciuto'));
      } catch (directError) {
        console.error('Tutti i tentativi di creazione tabella falliti:', directError);
        return { success: false, error: directError.message };
      }
    }
  } catch (err) {
    console.error('Eccezione durante la creazione della tabella:', err);
    return { success: false, error: err.message };
  }
};

// Funzione di verifica della connessione
export const testConnection = async () => {
  try {
    console.log('Tentativo di connessione a Supabase...');
    
    // Verifica la connessione con una query semplice
    const { data, error } = await supabase
      .from('sanzioni_violations')
      .select('count(*)', { count: 'exact', head: true })
      .limit(1);
    
    // Se la tabella non esiste, il codice errore sarà specifico
    if (error && error.code === '42P01') {
      console.log('Connessione a Supabase stabilita, ma la tabella non esiste');
      
      // Tenta di creare la tabella
      const createResult = await createSanzioniTable();
      
      if (createResult.success) {
        // Se la tabella è stata creata, inserisci dati di esempio
        const insertResult = await insertExampleData();
        
        return { 
          success: true, 
          tableCreated: true,
          dataInserted: insertResult.success && !insertResult.skipped
        };
      } else {
        return { 
          success: true, 
          tableExists: false, 
          createError: createResult.error 
        };
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
testConnection()
  .then(result => {
    if (result.success) {
      console.log('Connessione a Supabase verificata con successo');
      if (result.tableCreated) {
        console.log('La tabella sanzioni_violations è stata creata');
      }
    } else {
      console.error('Problema di connessione a Supabase:', result.error);
    }
  })
  .catch(err => {
    console.error('Errore imprevisto durante il test di connessione:', err);
  });

export default supabase;