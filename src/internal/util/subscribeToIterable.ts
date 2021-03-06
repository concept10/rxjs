import { Subscriber } from '../Subscriber.ts';
import { iterator as Symbol_iterator } from '../symbol/iterator.ts';

export const subscribeToIterable = <T>(iterable: Iterable<T>) => (subscriber: Subscriber<T>) => {
  const iterator = (iterable as any)[Symbol_iterator]();

  do {
    let item: IteratorResult<T>;
    try {
      item = iterator.next();
    } catch (err) {
      subscriber.error(err);
      return;
    }
    if (item.done) {
      subscriber.complete();
      break;
    }
    subscriber.next(item.value);
    if (subscriber.closed) {
      break;
    }
  } while (true);

  // Finalize the iterator if it happens to be a Generator
  if (typeof iterator.return === 'function') {
    subscriber.add(() => {
      if (iterator.return) {
        iterator.return();
      }
    });
  }

  return subscriber;
};
