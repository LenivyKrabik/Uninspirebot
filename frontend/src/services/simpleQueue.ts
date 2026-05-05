class queue<T> {
  mainStorage: T[] = [];

  enqueue(item: T) {
    this.mainStorage.push(item);
  }
}

export default queue;
