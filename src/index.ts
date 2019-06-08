import Y, { Generator } from './core'

export default function Yield<T, F extends Generator<T>>(
  ...it: [F, ...Array<Generator<T>>]
) {
  return new Y<T, F>(...it)
}
