import { DependencyList, useEffect } from "react";

export function useDebounceEffect(
    fn: () => void,
    delay: number,
    deps: DependencyList
) {
    useEffect(() => {
        const handler = setTimeout(() => {
            fn();
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [...(deps || []), delay]);
}
