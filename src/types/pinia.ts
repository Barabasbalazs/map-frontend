import "pinia";

declare module "pinia" {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: {
      enabled: boolean;
      strategies: Array<{
        key: string;
        storage: Storage;
      }>;
    };
  }
}
