export interface FileStatProvider {
  getSize(filePath: string): Promise<number>;
}
