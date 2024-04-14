
type PromiseFn = (...args: any) => Promise<any>
export const promiseLimit = async (arr: any[], fn: PromiseFn, limit: number) => {
  try {
    const pools: Promise<unknown>[] = []
    for (let i = 0; i < arr.length; i++) {
      const task = fn(arr[i])
      Promise.resolve(task).then(() => {
        // 执行完成,从pools中移除
        const idx = pools.findIndex(x => x === task)
        pools.splice(idx, 1)
      })
      pools.push(task)
      if (pools.length >= limit) {
        // 等待并发池执行完一个任务后
        await Promise.race(pools)
      }
    }
  } catch (err) {
    console.error(err)
  }
}
