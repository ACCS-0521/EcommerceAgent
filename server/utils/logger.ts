export const logger = {
  info(message: string): void {
    console.info(`[info] ${message}`);
  },
  error(message: string): void {
    console.error(`[error] ${message}`);
  },
};
