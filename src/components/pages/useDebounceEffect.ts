import { useEffect } from "react";

export function useDebounceEffect(
    fn: () => void,
    delay: number,
    deps: any[]
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
