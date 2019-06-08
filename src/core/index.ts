/*
 * @Author: saber2pr
 * @Date: 2019-06-08 14:29:59
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-06-08 14:59:28
 */
export type Generator<T> = (...args: any[]) => IterableIterator<T>
export type GetParamsType<F> = F extends (...args: infer T) => any ? T : never

export default class Yield<T, F extends Generator<T>> {
  public constructor(...it: [F, ...Array<Generator<T>>]) {
    this.itQueue = it
  }

  private readonly itQueue: [F, ...Array<Generator<T>>]
  private current: IterableIterator<T>

  private readonly interceptors: Array<(value: T) => T> = []

  private reset = (...param: T[]) => {
    this.current = this.itQueue.shift()(...param)
  }

  private next = (...param: T[]) => {
    const result = this.current.next(...param)

    if (result.done && this.itQueue.length) {
      this.reset(...param)
      return this.next(...param)
    }

    return result
  }

  public exec(...param: GetParamsType<F>): Promise<T> {
    this.current || this.reset(...param)

    const result = this.next(...param)

    const value = this.interceptors.reduce((v, i) => i(v), result.value)

    if (result.done) return Promise.resolve(value)

    return Promise.resolve(value).then(p => this.exec.call(this, p))
  }

  public use(interceptor: (value: T) => T) {
    this.interceptors.push(interceptor)
    return this
  }
}
