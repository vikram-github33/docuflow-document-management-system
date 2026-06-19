import { useState, useCallback } from 'react';
import { initiateUpload } from '../services/upload.service';
import type { InitiateUploadRequest, InitiateUploadResponse } from '../types/upload.types';

interface UseInitiateUploadResult {
  initiate: (payload: InitiateUploadRequest) => Promise<InitiateUploadResponse | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useInitiateUpload(): UseInitiateUploadResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => { setError(null); setIsLoading(false); }, []);

  const initiate = useCallback(async (payload: InitiateUploadRequest): Promise<InitiateUploadResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await initiateUpload(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate upload.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { initiate, isLoading, error, reset };
}
