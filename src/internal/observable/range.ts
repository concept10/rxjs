import { SchedulerAction, SchedulerLike } from '../types.ts';
import { Observable } from '../Observable.ts';

/**
 * Creates an Observable that emits a sequence of numbers within a specified
 * range.
 *
 * <span class="informal">Emits a sequence of numbers in a range.</span>
 *
 * ![](range.png)
 *
 * `range` operator emits a range of sequential integers, in order, where you
 * select the `start` of the range and its `length`. By default, uses no
 * {@link SchedulerLike} and just delivers the notifications synchronously, but may use
 * an optional {@link SchedulerLike} to regulate those deliveries.
 *
 * ## Example
 *
 * ### Produce a range of numbers
 *
 * ```ts
 * import { range } from 'rxjs.ts';
 *
 * const numbers = range(1, 3);
 *
 * numbers.subscribe({
 *  next: value => { console.log(value) },
 *  complete: () => { console.log('Complete!') }
 * });
 *
 * // Logs:
 * // 1
 * // 2
 * // 3
 * // "Complete!"
 * ```
 *
 * @see {@link timer}
 * @see {@link index/interval}
 *
 * @param {number} [start=0] The value of the first integer in the sequence.
 * @param {number} count The number of sequential integers to generate.
 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} to use for scheduling
 * the emissions of the notifications.
 * @return {Observable} An Observable of numbers that emits a finite range of
 * sequential integers.
 * @static true
 * @name range
 * @owner Observable
 */
export function range(start: number = 0,
                      count?: number,
                      scheduler?: SchedulerLike): Observable<number> {
  return new Observable<number>(subscriber => {
    if (count === undefined) {
      count = start;
      start = 0;
    }

    let index = 0;
    let current = start;

    if (scheduler) {
      return scheduler.schedule(dispatch, 0, {
        index, count, start, subscriber
      });
    } else {
      do {
        if (index++ >= count) {
          subscriber.complete();
          break;
        }
        subscriber.next(current++);
        if (subscriber.closed) {
          break;
        }
      } while (true);
    }

    return undefined;
  });
}

/** @internal */
export function dispatch(this: SchedulerAction<any>, state: any) {
  const { start, index, count, subscriber } = state;

  if (index >= count) {
    subscriber.complete();
    return;
  }

  subscriber.next(start);

  if (subscriber.closed) {
    return;
  }

  state.index = index + 1;
  state.start = start + 1;

  this.schedule(state);
}
