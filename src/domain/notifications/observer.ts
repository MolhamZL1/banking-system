export interface Observer<E> {
  update(event: E): Promise<void> | void;
}
