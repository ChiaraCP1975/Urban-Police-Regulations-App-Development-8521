import { useState, useEffect, useCallback } from 'react';
import supabase, { testConnection } from '../lib/supabase';

export const useSanzioni = () => {
  const [sanzioni, setSanzioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [retries, setRetries] = useState(0);
  const MAX_RETRIES = 3;

  // Funzione per ordinare le sanzioni per articolo e comma
  const sortSanzioni = (sanzioniArray) => {
    if (!Array.isArray(sanzioniArray) || sanzioniArray.length === 0) {
      return [];
    }
    
    return sanzioniArray.sort((a, b) => {
      // Estrai il numero dell'articolo (rimuovi "Art. " e converti in numero)
      const getArticoloNumber = (articolo) => {
        if (!articolo) return 0;
        const match = articolo.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      // Estrai il numero del comma (converti in numero, se vuoto considera 0)
      const getCommaNumber = (comma) => {
        if (!comma) return 0;
        const match = comma.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      const articoloA = getArticoloNumber(a.articolo);
      const articoloB = getArticoloNumber(b.articolo);

      // Prima ordina per articolo
      if (articoloA !== articoloB) {
        return articoloA - articoloB;
      }

      // Se l'articolo è lo stesso, ordina per comma
      const commaA = getCommaNumber(a.comma);
      const commaB = getCommaNumber(b.comma);
      return commaA - commaB;
    });
  };

  // Verifica connessione a Supabase
  const checkConnection = async () => {
    try {
      console.log('Verifica connessione Supabase...');
      const result = await testConnection();
      
      if (!result.success) {
        console.error('Errore di connessione:', result.error);
        setConnected(false);
        setError(`Errore di connessione al database: ${result.error}`);
        return false;
      }
      
      setConnected(true);
      setError(null);
      return true;
    } catch (err) {
      console.error('Errore durante il controllo connessione:', err.message);
      setConnected(false);
      setError('Errore durante il controllo della connessione: ' + err.message);
      return false;
    }
  };

  // Carica sanzioni dal database
  const loadSanzioni = useCallback(async (retry = false) => {
    try {
      setLoading(true);
      if (!retry) setError(null);

      // Verifica la connessione prima di procedere
      const isConnected = await checkConnection();
      if (!isConnected) {
        if (retries < MAX_RETRIES) {
          console.log(`Tentativo ${retries + 1} di ${MAX_RETRIES}...`);
          setTimeout(() => {
            setRetries(prev => prev + 1);
            loadSanzioni(true);
          }, 2000); // Riprova dopo 2 secondi
          return;
        }
        setLoading(false);
        return;
      }

      console.log('Caricamento sanzioni...');
      const { data, error } = await supabase
        .from('sanzioni_violations')
        .select('*');

      if (error) {
        throw error;
      }

      console.log(`Sanzioni caricate: ${data?.length || 0}`);
      
      // Ordina i dati per articolo e comma
      const sortedData = sortSanzioni(data || []);
      setSanzioni(sortedData);
      setRetries(0); // Reset tentativi
    } catch (err) {
      console.error('Error loading sanzioni:', err);
      setError('Errore nel caricamento delle sanzioni: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [retries]);

  // Salva una nuova sanzione
  const saveSanzione = async (sanzioneData) => {
    try {
      // Verifica la connessione prima di procedere
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error('Impossibile connettersi al database');
      }

      console.log('Salvataggio nuova sanzione:', sanzioneData);
      const { data, error } = await supabase
        .from('sanzioni_violations')
        .insert([{
          articolo: sanzioneData.articolo,
          comma: sanzioneData.comma,
          categoria: sanzioneData.categoria,
          descrizione: sanzioneData.descrizione,
          pmr: sanzioneData.pmr,
          sanzioni_accessorie: sanzioneData.sanzioniAccessorie,
          altro: sanzioneData.altro
        }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('Sanzione salvata con successo:', data[0]);
        // Aggiorna la lista locale e riordina
        setSanzioni(prev => sortSanzioni([...prev, data[0]]));
        return data[0];
      } else {
        throw new Error('Nessun dato restituito dopo il salvataggio');
      }
    } catch (err) {
      console.error('Error saving sanzione:', err);
      setError('Errore nel salvare la sanzione: ' + err.message);
      throw err;
    }
  };

  // Aggiorna una sanzione esistente
  const updateSanzione = async (id, sanzioneData) => {
    try {
      // Verifica la connessione prima di procedere
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error('Impossibile connettersi al database');
      }

      console.log(`Aggiornamento sanzione ID: ${id}`, sanzioneData);
      const { data, error } = await supabase
        .from('sanzioni_violations')
        .update({
          articolo: sanzioneData.articolo,
          comma: sanzioneData.comma,
          categoria: sanzioneData.categoria,
          descrizione: sanzioneData.descrizione,
          pmr: sanzioneData.pmr,
          sanzioni_accessorie: sanzioneData.sanzioniAccessorie,
          altro: sanzioneData.altro,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('Sanzione aggiornata con successo:', data[0]);
        // Aggiorna la lista locale e riordina
        setSanzioni(prev => sortSanzioni(prev.map(s => s.id === id ? data[0] : s)));
        return data[0];
      } else {
        throw new Error('Nessun dato restituito dopo l\'aggiornamento');
      }
    } catch (err) {
      console.error('Error updating sanzione:', err);
      setError('Errore nell\'aggiornare la sanzione: ' + err.message);
      throw err;
    }
  };

  // Elimina una sanzione
  const deleteSanzione = async (id) => {
    try {
      // Verifica la connessione prima di procedere
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error('Impossibile connettersi al database');
      }

      console.log(`Eliminazione sanzione ID: ${id}`);
      const { error } = await supabase
        .from('sanzioni_violations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log('Sanzione eliminata con successo');
      // Rimuovi dalla lista locale
      setSanzioni(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting sanzione:', err);
      setError('Errore nell\'eliminare la sanzione: ' + err.message);
      throw err;
    }
  };

  // Carica i dati al mount
  useEffect(() => {
    loadSanzioni();
    
    // Cleanup function
    return () => {
      console.log('Pulizia hook useSanzioni');
    };
  }, [loadSanzioni]);

  // Setup realtime subscription
  useEffect(() => {
    if (!connected) return;
    
    console.log('Configurazione sottoscrizione realtime...');
    const channel = supabase
      .channel('sanzioni_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sanzioni_violations' },
        (payload) => {
          console.log('Cambiamento rilevato:', payload);
          // Ricarica i dati quando ci sono cambiamenti
          loadSanzioni();
        }
      )
      .subscribe();

    console.log('Sottoscrizione realtime attivata');

    return () => {
      console.log('Pulizia sottoscrizione realtime');
      supabase.removeChannel(channel);
    };
  }, [connected, loadSanzioni]);

  return {
    sanzioni,
    loading,
    error,
    connected,
    saveSanzione,
    updateSanzione,
    deleteSanzione,
    refreshSanzioni: () => loadSanzioni()
  };
};