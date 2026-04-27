import { ReactNode, createContext, useContext, useEffect } from 'react';

import { useAccount } from 'wagmi';

import { SourceWalletWithBalance, useMySources } from '@api/subsquid-network-squid';
import { useLocalStorageState } from '@hooks/useLocalStorageState';

interface SourceContextType {
  setSelectedSourceId: (sourceId: string) => void;
  sources: SourceWalletWithBalance[];
  selectedSource: SourceWalletWithBalance | undefined;
  isLoading: boolean;
}

const SourceContext = createContext<SourceContextType | undefined>(undefined);

export interface SourceProviderProps {
  children: ReactNode;
}

export function SourceProvider({ children }: SourceProviderProps) {
  const { address } = useAccount();
  // Keyed by wallet address so each account remembers its own selection.
  const [selectedSourceId, setSelectedSourceId] = useLocalStorageState<string | undefined>(
    `sqd.source.${address ?? ''}`,
    { defaultValue: undefined },
  );
  const { data: sources = [], isLoading } = useMySources();

  useEffect(() => {
    if (sources.length === 0) return;
    // Reset to first source when stored ID is missing or no longer in the list.
    if (selectedSourceId && sources.some(s => s.id === selectedSourceId)) return;
    setSelectedSourceId(sources[0].id);
  }, [selectedSourceId, sources, setSelectedSourceId]);

  const selectedSource = sources.find(source => source.id === selectedSourceId);

  const value: SourceContextType = {
    setSelectedSourceId,
    sources,
    selectedSource,
    isLoading,
  };

  return <SourceContext.Provider value={value}>{children}</SourceContext.Provider>;
}

export const useSourceContext = (): SourceContextType => {
  const context = useContext(SourceContext);
  if (context === undefined) {
    throw new Error('useSourceContext must be used within a SourceProvider');
  }
  return context;
};
