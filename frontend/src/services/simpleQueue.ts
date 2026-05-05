class queue<T> {
  mainStorage: T[] = [];

  enqueue(item: T) {
    this.mainStorage.push(item);
  }
  dequeue() {
    return this.mainStorage.shift();
  }
  peek() {
    return this.mainStorage[0];
  }
}

export default queue;
