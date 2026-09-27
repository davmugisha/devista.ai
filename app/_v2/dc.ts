'use client';

import { useReducer, useRef } from 'react';

type State = Record<string, unknown>;
type Props = { theme?: 'light' | 'dark' };

// The canvas artboards are written against a small class API (state, setState, props,
// renderVals). This keeps that API so their logic runs unchanged inside React.
export class DCLogic {
  props: Props;
  state: State = {};
  rerender: () => void = () => {};

  constructor(props: Props) {
    this.props = props;
  }

  setState(patch: State) {
    this.state = { ...this.state, ...patch };
    this.rerender();
  }
}

type Board = { new (props: Props): DCLogic & { renderVals(): unknown } };

export function useDC(Cls: Board, props: Props) {
  const ref = useRef<InstanceType<Board> | null>(null);
  const [, bump] = useReducer((n: number) => n + 1, 0);
  if (!ref.current) ref.current = new Cls(props);
  ref.current.props = props;
  ref.current.rerender = bump;
  return ref.current.renderVals();
}
