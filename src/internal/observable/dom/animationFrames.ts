import { Observable } from '../../Observable.ts';
import { RequestFrame } from '../../util/requestFrame.ts';

// TODO: move to types.ts
export interface TimestampProvider {
  now(): number;
}
const window = RequestFrame();
/**
 * An observable of animation frames
 *
 * Emits the the amount of time elapsed since subscription on each animation frame. Defaults to elapsed
 * milliseconds. Does not end on its own.
 *
 * Every subscription will start a separate animation loop. Since animation frames are always scheduled
 * by the browser to occur directly before a repaint, scheduling more than one animation frame synchronously
 * should not be much different or have more overhead than looping over an array of events during
 * a single animation frame. However, if for some reason the developer would like to ensure the
 * execution of animation-related handlers are all executed during the same task by the engine,
 * the `share` operator can be used.
 *
 * This is useful for setting up animations with RxJS.
 *
 * ### Example
 *
 * Tweening a div to move it on the screen
 *
 * ```ts
 * import { animationFrames } from 'rxjs.ts';
 * import { map, takeWhile, endWith } from 'rxjs/operators.ts';
 *
 * function tween(start: number, end: number, duration: number) {
 *   const diff = end - start;
 *   return animationFrames().pipe(
 *     // Figure out what percentage of time has passed
 *     map(elapsed => elapsed / duration),
 *     // Take the vector while less than 100%
 *     takeWhile(v => v < 1),
 *     // Finish with 100%
 *     endWith(1),
 *     // Calculate the distance traveled between start and end
 *     map(v => v * diff + start)
 *   );
 * }
 *
 * // Setup a div for us to move around
 * const div = document.createElement('div');
 * document.body.appendChild(div);
 * div.style.position = 'absolute.ts';
 * div.style.width = '40px.ts';
 * div.style.height = '40px.ts';
 * div.style.backgroundColor = 'lime.ts';
 * div.style.transform = 'translate3d(10px, 0, 0).ts';
 *
 * tween(10, 200, 4000).subscribe(x => {
 *   div.style.transform = `translate3d(${x}px, 0, 0)`;
 * });
 * ```
 *
 * ### Example
 *
 * Providing a custom timestamp provider
 *
 * ```ts
 * import { animationFrames, TimestampProvider } from 'rxjs.ts';
 *
 * // A custom timestamp provider
 * let now = 0;
 * const customTSProvider: TimestampProvider = {
 *   now() { return now++; }
 * };
 *
 * const source$ = animationFrames(customTSProvider);
 *
 * // Log increasing numbers 0...1...2... on every animation frame.
 * source$.subscribe(x => console.log(x));
 * ```
 *
 * @param timestampProvider An object with a `now` method that provides a numeric timestamp
 */
export function animationFrames(timestampProvider: TimestampProvider = Date) {
  return timestampProvider === Date ? DEFAULT_ANIMATION_FRAMES : animationFramesFactory(timestampProvider);
}

/**
 * Does the work of creating the observable for `animationFrames`.
 * @param timestampProvider The timestamp provider to use to create the observable
 */
function animationFramesFactory(timestampProvider: TimestampProvider) {
  return new Observable<number>((subscriber: any) => {
    let id: number;
    const start = timestampProvider.now();
    const run = () => {
      subscriber.next(timestampProvider.now() - start);
      if (!subscriber.closed) {
        id = window.requestAnimationFrame(run);
      }
    };
    id = window.requestAnimationFrame(run);
    return () => window.cancelAnimationFrame(id);
  });
}

/**
 * In the common case, where `Date` is passed to `animationFrames` as the default,
 * we use this shared observable to reduce overhead.
 */
const DEFAULT_ANIMATION_FRAMES = animationFramesFactory(Date);
