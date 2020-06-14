# ![RxJS](https://github.com/ReactiveX/rxjs/raw/master/docs_app/assets/Rx_Logo_S.png) RxJS: Reactive Extensions for Deno | [DenoBR](https://denobr.com)

Reactive reactive library for JavaScript. This is a new version of [RxJS](https://github.com/ReactiveX/rxjs) and is a newer version ready for RxJS use on Deno. This recording should have better performance, better modularity, better debugable call stacks, remain mainly compatible with previous versions, with some changes that show the API surface.
 
## Documentation
Coming soon, at moment your can use [the RxJS documentation](https://rxjs.dev/) 

## [Apache 2.0 License](LICENSE.txt)

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contribution Guidelines](CONTRIBUTING.md)
- [API Documentation - Coming Soon](#)
- [NOTICE](NOTICE.txt)

## Versions on this repository

- [master](https://github.com/ReactiveX/rxjs/commits/master) - 7.0.0.beta

## Using

```js
import { Observable } from 'https://raw.githubusercontent.com/DenoBRComunitty/rxjs/master/mod.ts';

const observable = new Observable(subscriber => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});

console.log('before subscribe');
observable.subscribe({
  next:(x) => { console.log('value ' + x); },
  error:(err) => { console.error('error: ' + err); },
  complete:() => { console.log('complete'); }
});
console.log('after subscribe');
```
