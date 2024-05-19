import { useEffect, useRef } from 'react';

export type AllowedPreviousValues = string | number | boolean;

export const usePrevious = <T extends AllowedPreviousValues>(value: T): T => {
    const ref = useRef<T>(value);
    useEffect(() => {
        ref.current = value;
    }, [value]);
    return ref.current;
};
