export class NotFoundError extends Error {
  constructor(path: string) {
    super(`file [${path}] could not be found`);
  }
}
