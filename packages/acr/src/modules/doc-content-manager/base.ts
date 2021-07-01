export interface IGitDocContentManager {
  getContentByPathWithRef(path: string, ref: string): Promise<string>;
}
