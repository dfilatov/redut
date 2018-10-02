interface Action<TType extends string, TPayload = void> {
    type: TType;
    payload: TPayload;
}

interface ActionWithoutPayloadCreator<TType extends string> {
    type: TType;
    (): Action<TType>;
}

interface ActionWithPayloadCreator<TType extends string, TPayload> {
    type: TType;
    (payload: TPayload): Action<TType, TPayload>;
}

type ActionCreator<TType extends string, TPayload = void, TFix = TPayload> = TPayload extends void?
    ActionWithoutPayloadCreator<TType> :
    ActionWithPayloadCreator<TType, TFix>;

function createAction<TType extends string>(type: TType): <TPayload>() => ActionCreator<TType, TPayload> {
    function res<TPayload>(): ActionCreator<TType, TPayload> {
        const actionCreator = <ActionCreator<TType, TPayload>>((payload: TPayload) => ({ type, payload }));

        actionCreator.type = type;

        return actionCreator;
    }

    return res;
}

type ActionCreators = Record<string, ActionCreator<string, any>>;

type ExtractActionType<
    TActionCreator extends ActionWithoutPayloadCreator<string> | ActionWithPayloadCreator<string, any>
> = ReturnType<TActionCreator> extends Action<infer TType, any>?
    TType extends string? TType : never :
    never;

type Values<T extends object> = T[keyof T];

type ExtractActionByType<TAction extends Action<TType>, TType extends string> =
    TAction extends { type: TType; }? TAction : never;

type ActionOf<
    TActionCreator extends ActionCreator<string, unknown> | ActionCreators
> = TActionCreator extends ActionCreators?
    ReturnType<Values<TActionCreator>> :
    TActionCreator extends ActionCreator<string, unknown>?
        ReturnType<TActionCreator> :
        never;

function createReducer<TState, TActionCreators extends ActionCreators>(
    initialState: TState,
    actionHandlers: {
        [ActionType in ExtractActionType<Values<TActionCreators>>]?:
            (
                state: TState,
                action: ExtractActionByType<ReturnType<Values<TActionCreators>>, ActionType>
            ) => TState
    }
): (
    state: TState | undefined,
    action:
    ExtractActionByType<
        ReturnType<Values<TActionCreators>>,
        ExtractActionType<Values<TActionCreators>> & string
    >
) => TState {
    return (state = initialState, action) => action.type in actionHandlers?
        actionHandlers[action.type]!(state, action) :
        state;
}

export {
    ActionOf,

    createAction,
    createReducer
};
