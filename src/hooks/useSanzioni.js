import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

export const useSanzioni = () => {
  const [sanzioni, setSanzioni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Funzione per ordinare le sanzioni per articolo e comma
  const sortSanzioni = (sanzioniArray) => {
    return sanzioniArray.sort((a, b) => {
      // Estrai il numero dell'articolo (rimuovi "Art. " e converti in numero)
      const getArticoloNumber = (articolo) => {
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

  // Carica sanzioni dal database
  const loadSanzioni = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sanzioni_violations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ordina i dati per articolo e comma
      const sortedData = sortSanzioni(data || []);
      setSanzioni(sortedData);
    } catch (err) {
      setError(err.message);
      console.error('Error loading sanzioni:', err);
    } finally {
      setLoading(false);
    }
  };

  // Salva una nuova sanzione
  const saveSanzione = async (sanzioneData) => {
    try {
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
        .select()
        .single();

      if (error) throw error;
      
      // Aggiorna la lista locale e riordina
      setSanzioni(prev => sortSanzioni([...prev, data]));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Aggiorna una sanzione esistente
  const updateSanzione = async (id, sanzioneData) => {
    try {
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
        .select()
        .single();

      if (error) throw error;
      
      // Aggiorna la lista locale e riordina
      setSanzioni(prev => sortSanzioni(prev.map(s => s.id === id ? data : s)));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Elimina una sanzione
  const deleteSanzione = async (id) => {
    try {
      const { error } = await supabase
        .from('sanzioni_violations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Rimuovi dalla lista locale (l'ordine rimane corretto)
      setSanzioni(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Carica i dati al mount
  useEffect(() => {
    loadSanzioni();
  }, []);

  // Setup realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('sanzioni_violations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sanzioni_violations' },
        (payload) => {
          console.log('Change received!', payload);
          // Ricarica i dati quando ci sono cambiamenti
          loadSanzioni();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    sanzioni,
    loading,
    error,
    saveSanzione,
    updateSanzione,
    deleteSanzione,
    refreshSanzioni: loadSanzioni
  };
};