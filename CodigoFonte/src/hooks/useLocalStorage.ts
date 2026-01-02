'use client';

import { useEffect, useState } from 'react';

/**
 * Hook personalizado para usar localStorage de forma segura no SSR
 * Evita erros de hidratação e problemas com renderização no servidor
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
	// Estado para armazenar o valor
	// Passa o initialValue para o useState para que possamos ter um valor correto no primeiro render
	const [storedValue, setStoredValue] = useState<T>(initialValue);
	const [isInitialized, setIsInitialized] = useState(false);

	// Efeito que roda apenas no cliente para buscar o valor do localStorage
	useEffect(() => {
		try {
			// Busca do localStorage no lado do cliente
			const item = window.localStorage.getItem(key);
			if (item) {
				setStoredValue(JSON.parse(item));
			}
		} catch (error) {
			console.log(`Error reading localStorage key "${key}":`, error);
		} finally {
			setIsInitialized(true);
		}
	}, [key]);

	// Função para atualizar o valor
	const setValue = (value: T | ((val: T) => T)) => {
		try {
			// Permite que value seja uma função para que tenha a mesma API que useState
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			
			// Salva no estado
			setStoredValue(valueToStore);
			
			// Salva no localStorage apenas no cliente
			if (typeof window !== 'undefined') {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			}
		} catch (error) {
			console.log(`Error setting localStorage key "${key}":`, error);
		}
	};

	return [storedValue, setValue];
}

/**
 * Hook para verificar se estamos no cliente
 */
export function useIsClient() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
}