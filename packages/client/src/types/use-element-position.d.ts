import { MutableRefObject } from 'react';

declare function useElementPosition<T = HTMLElement>(initial: {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}): [MutableRefObject<T>, { left: number; top: number; width: number; height: number }];

export = useElementPosition;
