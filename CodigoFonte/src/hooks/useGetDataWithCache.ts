import * as MemoryCache from 'memory-cache'

export const fetchDataWithCache = async (cacheKey: string, fetchFunction: { (): Promise<any>; (): any; }, expirationMs: number | undefined) => {
  try {
    const cachedData = MemoryCache.get(cacheKey);
    console.log({cachedData})
    if (cachedData) {
      console.log(`Data retrieved from cache for key: ${cacheKey}`);
      return cachedData;
    } else {
      const freshData = await fetchFunction();
      if (freshData) {
        MemoryCache.put(cacheKey, freshData, expirationMs);
        console.log(`Data fetched from API and cached for key: ${cacheKey}`);
        return freshData;
      } else {
        // Lida com o caso em que a função de busca retorna dados vazios
        throw new Error("Empty data returned from fetchFunction");
      }
    }
  } catch (error: any) {
    // Lida com erros ao buscar dados ou ao armazená-los em cache
    console.error(`Error fetching or caching data for key ${cacheKey}: ${error}`);
    throw error;
  }
};