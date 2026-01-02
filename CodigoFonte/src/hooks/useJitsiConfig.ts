import { useState, useEffect } from 'react';

interface JitsiConfig {
  serverUrl: string;
}

export const useJitsiConfig = () => {
  const [config, setConfig] = useState<JitsiConfig>({ serverUrl: 'meet.jit.si' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/jitsi/config');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar configuração do Jitsi');
        }
        
        const data = await response.json();
        setConfig(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar configuração do Jitsi:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        // Mantém o fallback em caso de erro
        setConfig({ serverUrl: 'meet.jit.si' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, isLoading, error };
};