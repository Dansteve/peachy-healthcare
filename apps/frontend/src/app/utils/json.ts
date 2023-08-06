import { Result } from 'neverthrow';

/** Safely parse JSON data using [neverthrow](https://github.com/supermacro/neverthrow#resultfromthrowable-static-class-method). */
export const parse = Result.fromThrowable(JSON.parse);

/** Safely stringify data using [neverthrow](https://github.com/supermacro/neverthrow#resultfromthrowable-static-class-method). */
export const stringify = Result.fromThrowable(JSON.stringify);
