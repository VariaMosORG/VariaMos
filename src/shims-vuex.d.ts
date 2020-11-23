import { Store } from '@/store/index.ts'; // path to store file

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store;
  }
}