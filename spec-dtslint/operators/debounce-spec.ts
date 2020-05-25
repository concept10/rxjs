import { of, timer } from 'rxjs.ts';
import { debounce } from 'rxjs/operators.ts';

it('should infer correctly', () => {
  const o = of(1, 2, 3).pipe(debounce(() => timer(47))); // $ExpectType Observable<number>
});

it('should infer correctly with a Promise', () => {
  const o = of(1, 2, 3).pipe(debounce(() => new Promise<boolean>(() => {}))); // $ExpectType Observable<number>
});

it('should enforce types', () => {
  const o = of(1, 2, 3).pipe(debounce()); // $ExpectError
  const p = of(1, 2, 3).pipe(debounce(() => {})); // $ExpectError
});
