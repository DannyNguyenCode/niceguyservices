export class LooneyTunesProductError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 400) {
    super(message);
    this.name = "LooneyTunesProductError";
    this.code = code;
    this.status = status;
  }
}
