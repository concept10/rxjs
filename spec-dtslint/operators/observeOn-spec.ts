import { of, asyncScheduler } from 'rxjs.ts';
import { observeOn } from 'rxjs/operators.ts';

it('should infer correctly', () => {
  const o = of('apple', 'banana', 'peach').pipe(observeOn(asyncScheduler)); // $ExpectType Observable<string>
});

it('should support a delay', () => {
  const o = of('apple', 'banana', 'peach').pipe(observeOn(asyncScheduler, 47)); // $ExpectType Observable<string>
});

it('should enforce types', () => {
  const p = of('apple', 'banana', 'peach').pipe(observeOn()); // $ExpectError
});

it('should enforce scheduler type', () => {
  const p = of('apple', 'banana', 'peach').pipe(observeOn('fruit')); // $ExpectError
});

it('should enforce delay type', () => {
  const p = of('apple', 'banana', 'peach').pipe(observeOn(asyncScheduler, '47')); // $ExpectError
});
