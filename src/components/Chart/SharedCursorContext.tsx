import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// ============================================================================
// Shared Cursor for synchronized chart interactions
// ============================================================================

interface CursorState {
  x: number;
  y: number;
}

interface SharedCursorContextValue {
  cursor: CursorState | null;
  setSharedCursor: (cursor: CursorState | null) => void;
}

const SharedCursorContext = createContext<SharedCursorContextValue | null>(null);

export function SharedCursorProvider({ children }: { children: React.ReactNode }) {
  const [cursor, setSharedCursor] = useState<CursorState | null>(null);

  return (
    <SharedCursorContext.Provider value={{ cursor, setSharedCursor }}>
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

  const [localCursor, setLocalCursor] = useState<CursorState | null>(null);

  // Normalize cursor position to relative coordinates (0-1)
  const normalizeCursor = useCallback((cursor: CursorState | null) => {
    if (!cursor || width <= 0 || height <= 0) return null;
    return {
      x: cursor.x / width,
      y: cursor.y / height,
    };
  }, [width, height]);

  // Denormalize cursor position back to pixel coordinates
  const denormalizeCursor = useCallback((cursor: CursorState | null) => {
    if (!cursor) return null;
    return {
      x: cursor.x * width,
      y: cursor.y * height,
    };
  }, [width, height]);

  const setCursor = useCallback(
    (cursor: CursorState | null) => {
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
