import { createContext, useCallback, useContext, useEffect, useState, useMemo } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface SharedCursorContextValue {
  cursor: CursorPosition | null;
  setSharedCursor: (cursor: CursorPosition | null) => void;
}

const SharedCursorContext = createContext<SharedCursorContextValue | null>(null);

export function SharedCursorProvider({ children }: { children: React.ReactNode }) {
  const [cursor, setSharedCursor] = useState<CursorPosition | null>(null);

  const value = useMemo(
    () => ({ cursor, setSharedCursor }),
    [cursor],
  );

  return (
    <SharedCursorContext.Provider value={value}>
      {children}
    </SharedCursorContext.Provider>
  );
}

interface UseSharedCursorProps {
  shared?: boolean;
  width: number;
  height: number;
}

export function useSharedCursor({ shared, width, height }: UseSharedCursorProps) {
  const context = useContext(SharedCursorContext);

  if (shared && !context) {
    throw new Error('useSharedCursor with shared=true must be used within a SharedCursorProvider');
  }

  const [localCursor, setLocalCursor] = useState<CursorPosition | null>(null);

  const normalizeCursor = useCallback(
    (cursor: CursorPosition | null): CursorPosition | null => {
      if (!cursor || width <= 0 || height <= 0) return null;
      return {
        x: cursor.x / width,
        y: cursor.y / height,
      };
    },
    [width, height],
  );

  const denormalizeCursor = useCallback(
    (cursor: CursorPosition | null): CursorPosition | null => {
      if (!cursor) return null;
      return {
        x: cursor.x * width,
        y: cursor.y * height,
      };
    },
    [width, height],
  );

  const setCursor = useCallback(
    (cursor: CursorPosition | null) => {
      setLocalCursor(cursor);
      if (shared && context) {
        context.setSharedCursor(normalizeCursor(cursor));
      }
    },
    [shared, context, normalizeCursor],
  );

  // Sync with shared cursor when in shared mode
  useEffect(() => {
    if (shared && context) {
      setLocalCursor(denormalizeCursor(context.cursor));
    }
  }, [shared, context, context?.cursor, denormalizeCursor]);

  return {
    cursor: localCursor,
    setCursor,
  };
}
