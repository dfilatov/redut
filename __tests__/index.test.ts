import { createAction, createReducer } from '../src/redut';

describe('createAction', () => {
    test('should create action creator', () => {
        const action = createAction('TEST')<void>();

        expect(
            action
        ).toBeInstanceOf(Function);
    });

    test('should return action with proper type', () => {
        const action = createAction('TEST')<void>();

        expect(
            action().type
        ).toBe('TEST');
    });

    test('should return action with proper payload', () => {
        const action = createAction('TEST')<{ p1: number; p2: string; }>();

        expect(
            action({ p1 : 3, p2 : 'str' }).payload
        ).toEqual({ p1 : 3, p2 : 'str' });
    });
});

describe('createReducer', () => {
    const action1 = createAction('INC')<void>(),
        action2 = createAction('DEC')<void>(),
        actions = { action1, action2 };

    test('should create reducer', () => {
        const reducer = createReducer<number, typeof actions>(0, {});

        expect(
            reducer
        ).toBeInstanceOf(Function);
    });

    test('should pass initial state if state is not specified', () => {
        const reducer = createReducer<number, typeof actions>(
            10,
            {
                [action1.type] : state => {
                    expect(
                        state
                    ).toBe(10);

                    return state;
                }
            });

        reducer(undefined, { type : 'INC', payload : undefined });
    });

    test('should not pass initial state if state is specified', () => {
        const reducer = createReducer<number, typeof actions>(
            10,
            {
                [action1.type] : state => {
                    expect(
                        state
                    ).toBe(1);

                    return state;
                }
            });

        reducer(1, { type : 'INC', payload : undefined });
    });

    test('should return original state if there is no handler for given action', () => {
        const reducer = createReducer<number, typeof actions>(0, {});

        expect(
            reducer(5, { type : 'INC', payload : undefined })
        ).toEqual(5);
    });

    test('should return state according to handler for given action', () => {
        const reducer = createReducer<number, typeof actions>(
                0,
                {
                    [action1.type] : state => state + 1,
                    [action2.type] : state => state - 1
                }),
            nextState = reducer(undefined, { type : 'INC', payload : undefined });

        expect(
            nextState
        ).toEqual(1);

        expect(
            reducer(nextState, { type : 'DEC', payload : undefined })
        ).toEqual(0);
    });
});
