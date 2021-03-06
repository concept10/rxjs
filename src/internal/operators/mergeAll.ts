import { mergeMap } from './mergeMap.ts';
import { identity } from '../util/identity.ts';
import { OperatorFunction, ObservableInput } from '../types.ts';

/**
 * Converts a higher-order Observable into a first-order Observable which
 * concurrently delivers all values that are emitted on the inner Observables.
 *
 * <span class="informal">Flattens an Observable-of-Observables.</span>
 *
 * ![](mergeAll.png)
 *
 * `mergeAll` subscribes to an Observable that emits Observables, also known as
 * a higher-order Observable. Each time it observes one of these emitted inner
 * Observables, it subscribes to that and delivers all the values from the
 * inner Observable on the output Observable. The output Observable only
 * completes once all inner Observables have completed. Any error delivered by
 * a inner Observable will be immediately emitted on the output Observable.
 *
 * ## Examples
 * Spawn a new interval Observable for each click event, and blend their outputs as one Observable
 * ```ts
 * import { fromEvent, interval } from 'rxjs.ts';
 * import { map, mergeAll } from 'rxjs/operators.ts';
 *
 * const clicks = fromEvent(document, 'click');
 * const higherOrder = clicks.pipe(map((ev) => interval(1000)));
 * const firstOrder = higherOrder.pipe(mergeAll());
 * firstOrder.subscribe(x => console.log(x));
 * ```
 *
 * Count from 0 to 9 every second for each click, but only allow 2 concurrent timers
 * ```ts
 * import { fromEvent, interval } from 'rxjs.ts';
 * import { take, map, mergeAll } from 'rxjs/operators.ts';
 *
 * const clicks = fromEvent(document, 'click');
 * const higherOrder = clicks.pipe(
 *   map((ev) => interval(1000).pipe(take(10))),
 * );
 * const firstOrder = higherOrder.pipe(mergeAll(2));
 * firstOrder.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link exhaust}
 * @see {@link merge}
 * @see {@link mergeMap}
 * @see {@link mergeMapTo}
 * @see {@link mergeScan}
 * @see {@link switchAll}
 * @see {@link switchMap}
 * @see {@link zipAll}
 *
 * @param {number} [concurrent=Infinity] Maximum number of inner
 * Observables being subscribed to concurrently.
 * @return {Observable} An Observable that emits values coming from all the
 * inner Observables emitted by the source Observable.
 * @name mergeAll
 */
export function mergeAll<T>(concurrent: number = Infinity): OperatorFunction<ObservableInput<T>, T> {
  return mergeMap(identity, concurrent);
}
