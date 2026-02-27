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

  useEffect(() => {
    if (!selectedSourceId && sources.length > 0) {
      setSelectedSourceId(sources[0].id);
    }
  }, [selectedSourceId, sources]);

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
