export class PmrAdoptionError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "PmrAdoptionError";
    this.code = code;
    this.status = status;
  }
}
