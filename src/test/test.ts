import Yield from '..'

const delay = (time: number) =>
  new Promise(res => setTimeout(() => res(time), time))

function* main(v: number, a: number) {
  console.log('last', v, a)
  const r1 = yield 1

  yield delay(1000)

  return yield 2
}

function* main2(v) {
  console.log('last', v)

  const r1 = yield 3

  yield delay(1000)

  return yield 4
}

Yield(main, main2)
  .use(v => {
    console.log('intercept:', v)
    return v
  })
  .exec(233, 23)
  .then(console.log)
