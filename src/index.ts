import Y, { Generator } from './core'

export default function Yield<F extends Generator<any>>(
  ...it: [F, ...Array<Generator<any>>]
) {
  return new Y<any, F>(...it)
}
