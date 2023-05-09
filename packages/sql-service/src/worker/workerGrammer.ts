
export abstract class WorkerGrammer {


  abstract doValidation(sql: string): string;
  abstract doComplete()
}

