import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

interface TickerContextType {
  addHook: (fn: () => void, ms: number) => void;
  removeHook: (fn: () => void, ms: number) => void;
}

const TickerContext = createContext<TickerContextType>({
  addHook: () => {},
  removeHook: () => {},
});

interface TickerProviderProps {
  children: ReactNode;
}

type HooksState = Record<number, Set<() => void>>;
type HooksAction =
  | { type: 'ADD_HOOK'; fn: () => void; ms: number }
  | { type: 'REMOVE_HOOK'; fn: () => void; ms: number };

function TickerInterval({ hooks, ms }: { hooks: Set<() => void>; ms: number }) {
  useEffect(() => {
    const interval = setInterval(() => hooks.forEach(hook => hook()), ms);
    return () => clearInterval(interval);
  }, [hooks, ms]);

  return null;
}

export function TickerProvider({ children }: TickerProviderProps) {
  const [hooks, dispatch] = useReducer((state: HooksState, action: HooksAction): HooksState => {
    const { ms, fn } = action;
    switch (action.type) {
      case 'ADD_HOOK': {
        const hooks = state[ms] ?? new Set();
        hooks.add(fn);
        return { ...state, [ms]: hooks };
      }
      case 'REMOVE_HOOK': {
        const hooks = state[ms];
        if (!hooks) return state;

        hooks.delete(fn);
        if (hooks.size === 0) {
          delete state[ms];
        }

        return { ...state };
      }
      default:
        return state;
    }
  }, {});

  const addHook = useCallback((fn: () => void, ms: number) => {
    dispatch({ type: 'ADD_HOOK', fn, ms });
  }, []);

  const removeHook = useCallback((fn: () => void, ms: number) => {
    dispatch({ type: 'REMOVE_HOOK', fn, ms });
  }, []);

  const intervals = useMemo(
    () =>
      Object.entries(hooks).map(([ms, hooks]) => (
        <TickerInterval key={ms} hooks={hooks} ms={Number(ms)} />
      )),
    [hooks],
  );

  return (
    <TickerContext.Provider value={{ addHook, removeHook }}>
      {intervals}
      {children}
    </TickerContext.Provider>
  );
}

export function useTicker(fn: () => void, ms: number = 1000) {
  const { addHook, removeHook } = useContext(TickerContext);

  useEffect(() => {
    addHook(fn, ms);
    return () => removeHook(fn, ms);
  }, [addHook, removeHook, fn, ms]);
}
