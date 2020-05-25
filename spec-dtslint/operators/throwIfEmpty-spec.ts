import { of } from 'rxjs.ts';
import { throwIfEmpty } from 'rxjs/operators.ts';

it('should infer correctly', () => {
  const o = of('a', 'b', 'c').pipe(throwIfEmpty()); // $ExpectType Observable<string>
});

it('should support an errorFactory', () => {
  const o = of('a', 'b', 'c').pipe(throwIfEmpty(() => 47)); // $ExpectType Observable<string>
});

it('should enforce errorFactory type', () => {
  const o = of('a', 'b', 'c').pipe(throwIfEmpty('nope')); // $ExpectError
  const p = of('a', 'b', 'c').pipe(throwIfEmpty(x => 47)); // $ExpectError
});
