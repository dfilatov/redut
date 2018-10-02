# Redut
[![Build Status](https://img.shields.io/travis/dfilatov/redut/master.svg?style=flat-square)](https://travis-ci.org/dfilatov/redut/branches)
[![NPM Version](https://img.shields.io/npm/v/redut.svg?style=flat-square)](https://www.npmjs.com/package/redut)

Redut is a minimal library to build type-safe redux applications with TypeScript and without a lot of boilerplate code. Actually it provides two helper functions (`createAction`, `createReducer`) and one helper type (`ActionOf`).

## Example

`counterActions.ts`:
```ts
import { createAction } from 'redut';

// actions without payload
export const increment = createAction('INCREMENT')<void>();
export const decrement = createAction('DECREMENT')<void>();

// actions with payload
export const incrementBy = createAction('INCREMENT_BY')<number>(); // `number` is a type of payload
export const decrementBy = createAction('DECREMENT_BY')<number>();
```

`counterReducer.ts`:
```ts
import { createReducer } from 'redut';
import * as counterActions from './counterActions';

type CounterState = number;

export const counterReducer = createReducer<CounterState, typeof counterActions>(
    0, // initial state
    {
        [counterActions.increment.type]: state => state + 1,
        [counterActions.decrement.type]: state => state - 1,
        [counterActions.incrementBy.type]: (state, action) => state + action.payload,
        [counterActions.decrementBy.type]: (state, action) => state - action.payload     
    });
```

No more verbose actions and action creators, no more `switch`/`case` reducers, no more extensive usage of string literals and full type safety!
