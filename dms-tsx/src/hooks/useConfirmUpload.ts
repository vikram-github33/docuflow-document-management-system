import { useState, useCallback } from 'react';
import { confirmUpload } from '../services/upload.service';
import type { ConfirmUploadRequest, ConfirmUploadResponse } from '../types/upload.types';

interface UseConfirmUploadResult {
  confirm: (payload: ConfirmUploadRequest) => Promise<ConfirmUploadResponse | null>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useConfirmUpload(): UseConfirmUploadResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => { setError(null); setIsLoading(false); }, []);

  const confirm = useCallback(async (payload: ConfirmUploadRequest): Promise<ConfirmUploadResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await confirmUpload(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm upload.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { confirm, isLoading, error, reset };
}
