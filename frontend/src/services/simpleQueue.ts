class queue<T> {
  mainStorage: T[] = [];

  enqueue(item: T) {
    this.mainStorage.push(item);
  }
  dequeue() {
    return this.mainStorage.shift();
  }
}

export default queue;
