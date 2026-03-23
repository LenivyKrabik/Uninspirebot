type itemIdentifier = "highest" | "lowest" | "oldest" | "newest";

class PriorityQueue<T> {
  priorityLane: number[] = [];
  orderLane: T[] = [];
  enqueue(item: T, priority: number) {
    this.orderLane.push(item);
    this.priorityLane.push(priority);
  }

  dequeue(identifier: itemIdentifier) {
    let indexToRemove;
    switch (identifier) {
      case "highest":
        indexToRemove = this.priorityLane.reduce((acc, value, index, array) => {
          const max = Math.max(array[acc], value);
          return max === value ? index : acc;
        }, 0);
        return { value: this.orderLane.splice(indexToRemove, 1), priority: this.priorityLane.splice(indexToRemove, 1) };
      case "lowest":
        indexToRemove = this.priorityLane.reduce((acc, value, index, array) => {
          const min = Math.min(array[acc], value);
          return min === value ? index : acc;
        }, 0);
        return { value: this.orderLane.splice(indexToRemove, 1), priority: this.priorityLane.splice(indexToRemove, 1) };
      case "oldest":
        return { value: this.orderLane.shift(), priority: this.priorityLane.shift() };
      case "newest":
        return { value: this.orderLane.pop(), priority: this.priorityLane.pop() };
      default:
        throw new Error(`Identifier: ${identifier} does not exist`);
    }
  }
  peek(identifier: itemIdentifier) {
    let indexToRemove;
    switch (identifier) {
      case "highest":
        indexToRemove = this.priorityLane.reduce((acc, value, index, array) => {
          const max = Math.max(array[acc], value);
          return max === value ? index : acc;
        }, 0);
        break;
      case "lowest":
        indexToRemove = this.priorityLane.reduce((acc, value, index, array) => {
          const min = Math.min(array[acc], value);
          return min === value ? index : acc;
        }, 0);
        break;
      case "oldest":
        indexToRemove = 0;
        break;
      case "newest":
        indexToRemove = this.orderLane.length - 1;
        break;
      default:
        throw new Error(`Identifier: ${identifier} does not exist`);
    }
    return { value: this.orderLane[indexToRemove], priority: this.priorityLane[indexToRemove] };
  }
}

export default PriorityQueue;
