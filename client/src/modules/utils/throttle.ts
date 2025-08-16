// Tiny throttle (no external dependency)
export function throttle<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let inFlight = false
  let lastArgs: any[] | null = null

  return function(this: any, ...args: any[]) {
    if (inFlight) {
      lastArgs = args
      return
    }
    inFlight = true
    fn.apply(this, args)
    setTimeout(() => {
      inFlight = false
      if (lastArgs) {
        fn.apply(this, lastArgs)
        lastArgs = null
      }
    }, wait)
  } as T
}
