import vue from 'vue';

export default class BaseVue extends vue {
  protected FindRef<T extends object>(refName: string) {
    const f = this.$refs[refName] as object;
    return f as T;
  }
}
