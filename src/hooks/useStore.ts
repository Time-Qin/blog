import { useRef, useSyncExternalStore } from "react"

interface useStoreProps<T> {
    api: {
        setState: (value: any) => void;
        getState: () => T;
        subscribe: (childe: any) => () => void;
    }
    selector: (state: T) => T extends Record<string, infer A> ? A : T
}

export default function useStore<T>({ api, selector }: useStoreProps<T>) {
    const { subscribe, getState } = api

    const _state = useRef(selector(getState()))

    _state.current = selector(getState())

    useSyncExternalStore(subscribe, () => selector(getState()))

    return _state.current as any
}
