export class _Error extends Error {
  constructor(public override message: string, public critical = false) {
    super(message);
    this.critical = critical;
  }

  public static readonly throw = (error: Error): void => {
    Promise.resolve().then(() => {
      throw error;
    });
  };
}
