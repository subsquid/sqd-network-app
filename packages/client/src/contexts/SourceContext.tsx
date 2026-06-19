import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { SourceWalletWithBalance, useMySources } from '@api/subsquid-network-squid';

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
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>();
  const { data: sources = [], isLoading } = useMySources();

  // Match case-insensitively: indexer-backed sources use lowercase ids, while the
  // synthetic fallback source (and wallet address) is EIP-55 checksummed. Without
  // this, the selected id can stop matching once real sources load, leaving the
  // page with no selected source until a remount.
  const selectedSource = sources.find(
    source => source.id.toLowerCase() === selectedSourceId?.toLowerCase(),
  );

  // (Re)select the first source whenever the current selection doesn't resolve to
  // an available source (initial load, or after the source list changes).
  useEffect(() => {
    if (sources.length > 0 && !selectedSource) {
      setSelectedSourceId(sources[0].id);
    }
  }, [sources, selectedSource]);

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
