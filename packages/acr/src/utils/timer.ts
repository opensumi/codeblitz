class Timer {
  private _timer: number;
  start() {
    this._timer = performance.now();
  }

  end() {
    return performance.now() - this._timer;
  }
}

export const start = () => {
  const timer = new Timer();
  timer.start();
  return timer;
};
