type EventId = number;

function* idGen(): Generator<EventId, void, unknown> {
  let id = 0;
  while (true) {
    yield id++;
  }
}

class EventEmitter {
  events: { [key: string]: { id: EventId; callback: VoidFunction }[] } = {};
  idSource = idGen();
  on(name: string, callback: VoidFunction) {
    const event = this.events[name];
    const reciever = { id: this.idSource.next().value!, callback: callback };
    if (event) event.push(reciever);
    else this.events[name] = [reciever];
  }

  emit(name: string) {
    const event = this.events[name];
    if (event) event.forEach((element) => element.callback());
  }

  unsubscrive(name: string, id: EventId) {
    const event = this.events[name];
    if (!event) return;
    const indexToRemove = event.findIndex((element) => element.id === id);
    event.splice(indexToRemove, 1);
  }
}

export default EventEmitter;
