import { Observable } from '../Observable.ts';
import { Subscriber } from '../Subscriber.ts';
import { identity } from '../util/identity.ts';
import { SchedulerAction, SchedulerLike } from '../types.ts';
import { isScheduler } from '../util/isScheduler.ts';

export type ConditionFunc<S> = (state: S) => boolean;
export type IterateFunc<S> = (state: S) => S;
export type ResultFunc<S, T> = (state: S) => T;

interface SchedulerState<T, S> {
  needIterate?: boolean;
  state: S;
  subscriber: Subscriber<T>;
  condition?: ConditionFunc<S>;
  iterate: IterateFunc<S>;
  resultSelector: ResultFunc<S, T>;
}

export interface GenerateBaseOptions<S> {
  /**
   * Initial state.
   */
  initialState: S;
  /**
   * Condition function that accepts state and returns boolean.
   * When it returns false, the generator stops.
   * If not specified, a generator never stops.
   */
  condition?: ConditionFunc<S>;
  /**
   * Iterate function that accepts state and returns new state.
   */
  iterate: IterateFunc<S>;
  /**
   * SchedulerLike to use for generation process.
   * By default, a generator starts immediately.
   */
  scheduler?: SchedulerLike;
}

export interface GenerateOptions<T, S> extends GenerateBaseOptions<S> {
  /**
   * Result selection function that accepts state and returns a value to emit.
   */
  resultSelector: ResultFunc<S, T>;
}

/**
 * Generates an observable sequence by running a state-driven loop
 * producing the sequence's elements, using the specified scheduler
 * to send out observer messages.
 *
 * ![](generate.png)
 *
 * ## Examples
 *
 * ### Produces sequences of number
 *
 * ```ts
 * import { generate } from 'rxjs.ts';
 *
 * const result = generate(0, x => x < 3, x => x + 1, x => x);
 *
 * result.subscribe(x => console.log(x));
 *
 * // Logs:
 * // 0
 * // 1
 * // 2
 * ```
 *
 * ### Use asap scheduler
 *
 * ```ts
 * import { generate } from 'rxjs.ts';
 *
 * const result = generate(1, x => x < 5, x => x * 2, x => x + 1, asap);
 *
 * result.subscribe(x => console.log(x));
 *
 * // Logs:
 * // 2
 * // 3
 * // 5
 * ```
 *
 * @see {@link from}
 * @see {@link Observable}
 *
 * @param {S} initialState Initial state.
 * @param {function (state: S): boolean} condition Condition to terminate generation (upon returning false).
 * @param {function (state: S): S} iterate Iteration step function.
 * @param {function (state: S): T} resultSelector Selector function for results produced in the sequence. (deprecated)
 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} on which to run the generator loop. If not provided, defaults to emit immediately.
 * @returns {Observable<T>} The generated sequence.
 */
  export function generate<T, S>(initialState: S,
                                 condition: ConditionFunc<S>,
                                 iterate: IterateFunc<S>,
                                 resultSelector: ResultFunc<S, T>,
                                 scheduler?: SchedulerLike): Observable<T>;

/**
 * Generates an Observable by running a state-driven loop
 * that emits an element on each iteration.
 *
 * <span class="informal">Use it instead of nexting values in a for loop.</span>
 *
 * ![](generate.png)
 *
 * `generate` allows you to create a stream of values generated with a loop very similar to
 * a traditional for loop. The first argument of `generate` is a beginning value. The second argument
 * is a function that accepts this value and tests if some condition still holds. If it does,
 * then the loop continues, if not, it stops. The third value is a function which takes the
 * previously defined value and modifies it in some way on each iteration. Note how these three parameters
 * are direct equivalents of three expressions in a traditional for loop: the first expression
 * initializes some state (for example, a numeric index), the second tests if the loop can perform the next
 * iteration (for example, if the index is lower than 10) and the third states how the defined value
 * will be modified on every step (for example, the index will be incremented by one).
 *
 * Return value of a `generate` operator is an Observable that on each loop iteration
 * emits a value. First of all, the condition function is ran. If it returns true, then the Observable
 * emits the currently stored value (initial value at the first iteration) and finally updates
 * that value with iterate function. If at some point the condition returns false, then the Observable
 * completes at that moment.
 *
 * Optionally you can pass a fourth parameter to `generate` - a result selector function which allows you
 * to immediately map the value that would normally be emitted by an Observable.
 *
 * If you find three anonymous functions in `generate` call hard to read, you can provide
 * a single object to the operator instead where the object has the properties: `initialState`,
 * `condition`, `iterate` and `resultSelector`, which should have respective values that you
 * would normally pass to `generate`. `resultSelector` is still optional, but that form
 * of calling `generate` allows you to omit `condition` as well. If you omit it, that means
 * condition always holds, or in other words the resulting Observable will never complete.
 *
 * Both forms of `generate` can optionally accept a scheduler. In case of a multi-parameter call,
 * scheduler simply comes as a last argument (no matter if there is a `resultSelector`
 * function or not). In case of a single-parameter call, you can provide it as a
 * `scheduler` property on the object passed to the operator. In both cases, a scheduler decides when
 * the next iteration of the loop will happen and therefore when the next value will be emitted
 * by the Observable. For example, to ensure that each value is pushed to the Observer
 * on a separate task in the event loop, you could use the `async` scheduler. Note that
 * by default (when no scheduler is passed) values are simply emitted synchronously.
 *
 *
 * ## Examples
 *
 * ### Use with condition and iterate functions
 *
 * ```ts
 * import { generate } from 'rxjs.ts';
 *
 * const result = generate(0, x => x < 3, x => x + 1);
 *
 * result.subscribe({
 *   next: value => console.log(value),
 *   complete: () => console.log('Complete!')
 * });
 *
 * // Logs:
 * // 0
 * // 1
 * // 2
 * // "Complete!"
 * ```
 *
 * ### Use with condition, iterate and resultSelector functions
 *
 * ```ts
 * import { generate } from 'rxjs.ts';
 *
 * const result = generate(0, x => x < 3, x => x + 1, x => x * 1000);
 *
 * result.subscribe({
 *   next: value => console.log(value),
 *   complete: () => console.log('complete!')
 * });
 *
 * // Logs:
 * // 0
 * // 1000
 * // 2000
 * // "complete!"
 * ```
 *
 * ### Use with options object
 *
 * ```ts
 * import { generate } from 'rxjs.ts';
 *
 * const result = generate({
 *   initialState: 0,
 *   condition(value) { return value < 3; },
 *   iterate(value) { return value + 1; },
 *   resultSelector(value) { return value * 1000; }
 * });
 *
 * result.subscribe({
 *   next: value => console.log(value),
 *   complete: () => console.log('complete!')
 * });
 *
 * // Logs:
 * // 0
 * // 1000
 * // 2000
 * // "Complete!"
 * ```
 *
 * ### Use options object without condition function
 *
 * ```ts
 * import { generate } from 'rxjs.ts';
 *
 * const result = generate({
 *   initialState: 0,
 *   iterate(value) { return value + 1; },
 *   resultSelector(value) { return value * 1000; }
 * });
 *
 * result.subscribe({
 *   next: value => console.log(value),
 *   complete: () => console.log('complete!') // This will never run
 * });
 *
 * // Logs:
 * // 0
 * // 1000
 * // 2000
 * // 3000
 * // ...and never stops.
 * ```
 *
 * @see {@link from}
 * @see {@link index/Observable.create}
 *
 * @param {S} initialState Initial state.
 * @param {function (state: S): boolean} condition Condition to terminate generation (upon returning false).
 * @param {function (state: S): S} iterate Iteration step function.
 * @param {function (state: S): T} [resultSelector] Selector function for results produced in the sequence.
 * @param {Scheduler} [scheduler] A {@link Scheduler} on which to run the generator loop. If not provided, defaults to emitting immediately.
 * @return {Observable<T>} The generated sequence.
 */
export function generate<S>(initialState: S,
                            condition: ConditionFunc<S>,
                            iterate: IterateFunc<S>,
                            scheduler?: SchedulerLike): Observable<S>;

/**
 * Generates an observable sequence by running a state-driven loop
 * producing the sequence's elements, using the specified scheduler
 * to send out observer messages.
 * The overload accepts options object that might contain initial state, iterate,
 * condition and scheduler.
 *
 * ![](generate.png)
 *
 * ## Examples
 *
 * ### Use options object with condition function
 *
 * ```ts
 * import { generate } from 'rxjs.ts';
 *
 * const result = generate({
 *   initialState: 0,
 *   condition: x => x < 3,
 *   iterate: x => x + 1,
 * });
 *
 * result.subscribe({
 *   next: value => console.log(value),
 *   complete: () => console.log('complete!')
 * });
 *
 * // Logs:
 * // 0
 * // 1
 * // 2
 * // "Complete!".
 * ```
 *
 * @see {@link from}
 * @see {@link Observable}
 *
 * @param {GenerateBaseOptions<S>} options Object that must contain initialState, iterate and might contain condition and scheduler.
 * @returns {Observable<S>} The generated sequence.
 */
export function generate<S>(options: GenerateBaseOptions<S>): Observable<S>;

/**
 * Generates an observable sequence by running a state-driven loop
 * producing the sequence's elements, using the specified scheduler
 * to send out observer messages.
 * The overload accepts options object that might contain initial state, iterate,
 * condition, result selector and scheduler.
 *
 * ![](generate.png)
 *
 * ## Examples
 *
 * ### Use options object with condition and iterate function
 *
 * ```ts
 * import { generate } from 'rxjs.ts';
 *
 * const result = generate({
 *   initialState: 0,
 *   condition: x => x < 3,
 *   iterate: x => x + 1,
 *   resultSelector: x => x,
 * });
 *
 * result.subscribe({
 *   next: value => console.log(value),
 *   complete: () => console.log('complete!')
 * });
 *
 * // Logs:
 * // 0
 * // 1
 * // 2
 * // "Complete!".
 * ```
 *
 * @see {@link from}
 * @see {@link Observable}
 *
 * @param {GenerateOptions<T, S>} options Object that must contain initialState, iterate, resultSelector and might contain condition and scheduler.
 * @returns {Observable<T>} The generated sequence.
 */
export function generate<T, S>(options: GenerateOptions<T, S>): Observable<T>;

export function generate<T, S>(initialStateOrOptions: S | GenerateOptions<T, S>,
                               condition?: ConditionFunc<S>,
                               iterate?: IterateFunc<S>,
                               resultSelectorOrScheduler?: (ResultFunc<S, T>) | SchedulerLike,
                               scheduler?: SchedulerLike): Observable<T> {

  let resultSelector: ResultFunc<S, T>;
  let initialState: S;

  if (arguments.length == 1) {
    const options = initialStateOrOptions as GenerateOptions<T, S>;
    initialState = options.initialState;
    condition = options.condition;
    iterate = options.iterate;
    resultSelector = options.resultSelector || identity as ResultFunc<S, T>;
    scheduler = options.scheduler;
  } else if (resultSelectorOrScheduler === undefined || isScheduler(resultSelectorOrScheduler)) {
    initialState = initialStateOrOptions as S;
    resultSelector = identity as ResultFunc<S, T>;
    scheduler = resultSelectorOrScheduler as SchedulerLike;
  } else {
    initialState = initialStateOrOptions as S;
    resultSelector = resultSelectorOrScheduler as ResultFunc<S, T>;
  }

  return new Observable<T>(subscriber => {
    let state = initialState;
    if (scheduler) {
      return scheduler.schedule<SchedulerState<T, S>>(dispatch as any, 0, {
        subscriber,
        iterate: iterate!,
        condition,
        resultSelector,
        state
      });
    }

    do {
      if (condition) {
        let conditionResult: boolean;
        try {
          conditionResult = condition(state);
        } catch (err) {
          subscriber.error(err);
          return undefined;
        }
        if (!conditionResult) {
          subscriber.complete();
          break;
        }
      }
      let value: T;
      try {
        value = resultSelector(state);
      } catch (err) {
        subscriber.error(err);
        return undefined;
      }
      subscriber.next(value);
      if (subscriber.closed) {
        break;
      }
      try {
        state = iterate!(state);
      } catch (err) {
        subscriber.error(err);
        return undefined;
      }
    } while (true);

    return undefined;
  });
}

function dispatch<T, S>(this: SchedulerAction<SchedulerState<T, S>>, state: SchedulerState<T, S>) {
  const { subscriber, condition } = state;
  if (subscriber.closed) {
    return undefined;
  }
  if (state.needIterate) {
    try {
      state.state = state.iterate(state.state);
    } catch (err) {
      subscriber.error(err);
      return undefined;
    }
  } else {
    state.needIterate = true;
  }
  if (condition) {
    let conditionResult: boolean;
    try {
      conditionResult = condition(state.state);
    } catch (err) {
      subscriber.error(err);
      return undefined;
    }
    if (!conditionResult) {
      subscriber.complete();
      return undefined;
    }
    if (subscriber.closed) {
      return undefined;
    }
  }
  let value: T;
  try {
    value = state.resultSelector(state.state);
  } catch (err) {
    subscriber.error(err);
    return undefined;
  }
  if (subscriber.closed) {
    return undefined;
  }
  subscriber.next(value);
  if (subscriber.closed) {
    return undefined;
  }
  return this.schedule(state);
}
