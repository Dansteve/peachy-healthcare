import { Err, err, Ok, ok } from 'neverthrow';

/** Returns true if `arg` is null, undefined, or NaN. */
export const isNil = (arg: unknown) => arg === void 0 || arg === null || Number.isNaN(arg);

/** Returns `true` if `arg` is an array with a length of zero. */
export const isEmpty = <T>(arg: T) => Array.isArray(arg) && arg.length === 0;

/** Returns `true` if any member of `arg` is an array with a length of zero. */
export const isEmptyArray = <T>(args: T[]) => args.some(isEmpty);

/** Returns `true` if `arg` is an object with no property values. */
export const isEmptyObject = <T>(arg: T) => isEmpty(Object.keys(arg));

/** Returns true if `arg` is a string of any length. */
export const isString = (arg: unknown): boolean => typeof arg === 'string';

/** Returns a `Result` using [neverthrow](https://github.com/supermacro/neverthrow). */
export const maybe = <T>(arg: T): Err<never, null> | Ok<T, never> => isNil(arg) ? err(null) : ok(arg);
