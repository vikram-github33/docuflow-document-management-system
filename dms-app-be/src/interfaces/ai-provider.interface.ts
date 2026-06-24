export interface IAiProvider {
  summarize(
    text: string,
  ): Promise<string>;

  generateTags(
    text: string,
  ): Promise<string>;

  classify(
    text: string,
  ): Promise<string>;
}