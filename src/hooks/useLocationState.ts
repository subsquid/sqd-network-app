import { isArray, isDate, mapValues, pickBy } from 'lodash-es';
import qs from 'qs';
import { useNavigate, useLocation } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Location {
  export class Param {
    public initial?: unknown;
    public options: {
      onStateChange?: <T>(state: T) => T;
    } = {};

    public parse(v: any): any {
      return v;
    }
  }

  export class Bool extends Param {
    constructor(public initial?: boolean) {
      super();
    }

    parse(val: any): boolean | undefined {
      if (typeof val === 'boolean') return val;
      else if (val === 'true') return true;
      else if (val === 'false') return false;

      return undefined;
    }
  }

  export class String extends Param {
    constructor(public initial?: string) {
      super();
    }
  }

  export class Enum<T = string> extends Param {
    constructor(public initial?: T) {
      super();
    }
  }

  export class Number extends Param {
    constructor(public initial?: number) {
      super();
    }

    parse(val: any): number {
      if (typeof val === 'number') return val;

      return parseInt(val, 10);
    }
  }

  export class IsoDate extends Param {
    constructor(public initial?: Date) {
      super();
    }

    parse(val: any): Date {
      if (isDate(val)) return val;

      return new Date(val);
    }
  }

  export class Array<T extends Param> extends Param {
    constructor(
      private itemType: T,
      public initial?: any[],
    ) {
      super();
    }

    parse(val: any): any[] {
      if (isArray(val)) {
        return val.map(v => this.itemType.parse(v));
      }
      if (val === undefined || val === null) {
        return this.initial ?? [];
      }
      return [this.itemType.parse(val)];
    }
  }
}

type TypeName<T> = T extends Location.Array<infer U>
  ? TypeName<U>[]
  : T extends Location.String
    ? string
    : T extends Location.Enum<infer U>
      ? U
      : T extends Location.Number
        ? number
        : T extends Location.Bool
          ? boolean
          : T extends Location.IsoDate
            ? Date
            : never;

export function useLocationState<
  Query extends Record<string | symbol, Location.Param>,
  State = {
    [P in keyof Query]: TypeName<Query[P]>;
  },
  SetState = { [P in keyof State]: (val: State[P]) => void },
>(params: Query): [values: State, setValues: SetState] {
  const location = useLocation();
  const navigate = useNavigate();

  const initialState = mapValues(params, v => v.initial);
  const queryValues = pickBy(
    mapValues(qs.parse(location.search.substring(1)), (v, k) => {
      if (!params[k]) return null;

      const val = params[k]?.parse(v);

      return val;
    }),
    v => v !== null,
  );

  const state = pickBy(
    {
      ...initialState,
      ...queryValues,
    },
    v => typeof v !== 'undefined',
  ) as State;

  const keys = Object.keys(initialState) as Array<keyof State>;
  const setState = keys.reduce((t, k) => {
    t[k] = (val: State[keyof State]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if ('page' in state) {
        delete state['page'];
      }

      if (typeof val !== 'undefined') {
        if (val instanceof Date) {
          state[k] = val.toISOString() as any;
        } else {
          state[k] = val;
        }
      } else {
        delete state[k];
      }

      const clearState = pickBy(state as Record<string, unknown>, (v, k) => {
        return v !== initialState[k];
      });
      location.search = '?' + qs.stringify(clearState, { arrayFormat: 'repeat' });
      navigate(location);
    };

    return t;
  }, Object.create(null));

  return [state, setState];
}
