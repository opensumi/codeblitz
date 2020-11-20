export class Task {
  private _queue: (() => Promise<void>)[] = []
  private _active: number = 0
  private _limit: number = 0

  constructor(limit = 1) {
    this._limit = limit
  }

  add(work: (() => Promise<any>) | (() => Promise<any>)[]) {
    if (Array.isArray(work)) {
      work.forEach(item => this.add(item))
    } else {
      this._queue.push(work)
      this.run()
    }
  }

  private async run() {
    if (this._queue.length === 0 || this._active === this._limit) {
      return
    }
    const next = this._queue.shift()
    this._active++
    if (this._active > this._limit) {
      throw new Error(`To many tasks active`);
    }
    try {
      await next?.()
      this._active--
      this.run()
    } catch(err) {
      this._active--
      this.run()
    }
  }
}

export const parallelLimit = (works: (() => Promise<void>)[], limit: number) => {
  const task = new Task(limit)
  const len = works.length
  let count = 0
  return new Promise((resolve) => {
    works.forEach((work) => {
      task.add(async () => {
        await work()
        count++
        if (count === len) {
          resolve()
        }
      })
    })
  })
}
