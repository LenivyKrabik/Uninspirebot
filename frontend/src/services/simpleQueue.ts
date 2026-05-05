class queue<T> {
  mainStorage: T[] = [];
  maxSize: number;

  constructor(size: number = Infinity) {
    this.maxSize = size;
  }

  enqueue(item: T) {
    if (this.mainStorage.length >= this.maxSize) throw new Error("Queue overflow");
    this.mainStorage.push(item);
  }
  dequeue() {
    return this.mainStorage.shift();
  }
  peek() {
    return this.mainStorage[0];
  }
  size() {
    return this.mainStorage.length;
  }
}

export default queue;
