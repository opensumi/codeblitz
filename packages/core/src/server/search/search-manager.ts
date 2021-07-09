export class BatchedCollector<T> {
  private static readonly TIMEOUT = 4000;

  // After START_BATCH_AFTER_COUNT items have been collected, stop flushing on timeout
  private static readonly START_BATCH_AFTER_COUNT = 0;

  private totalNumberCompleted = 0;
  private batch: T[] = [];
  private batchSize = 0;
  private timeoutHandle: any;

  constructor(private maxBatchSize: number, private cb: (items: T[]) => void) {}

  get total() {
    return this.totalNumberCompleted + this.batchSize;
  }

  addItem(item: T, size: number): void {
    if (!item) {
      return;
    }

    this.addItemToBatch(item, size);
  }

  addItems(items: T[], size: number): void {
    if (!items) {
      return;
    }

    this.addItemsToBatch(items, size);
  }

  private addItemToBatch(item: T, size: number): void {
    this.batch.push(item);
    this.batchSize += size;
    this.onUpdate();
  }

  private addItemsToBatch(item: T[], size: number): void {
    this.batch = this.batch.concat(item);
    this.batchSize += size;
    this.onUpdate();
  }

  private onUpdate(): void {
    if (this.totalNumberCompleted < BatchedCollector.START_BATCH_AFTER_COUNT) {
      // Flush because we aren't batching yet
      this.flush();
    } else if (this.batchSize >= this.maxBatchSize) {
      // Flush because the batch is full
      this.flush();
    } else if (!this.timeoutHandle) {
      // No timeout running, start a timeout to flush
      this.timeoutHandle = setTimeout(() => {
        this.flush();
      }, BatchedCollector.TIMEOUT);
    }
  }

  flush(): void {
    if (this.batchSize) {
      this.totalNumberCompleted += this.batchSize;
      this.cb(this.batch);
      this.batch = [];
      this.batchSize = 0;

      if (this.timeoutHandle) {
        clearTimeout(this.timeoutHandle);
        this.timeoutHandle = 0;
      }
    }
  }
}
