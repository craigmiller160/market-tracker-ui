import * as Option from 'fp-ts/es6/Option';
import { match, when } from 'ts-pattern';

export const captureFromRegex = <T>(
	regex: RegExp | string,
	text: string
): Option.Option<T> =>
	match(text)
		.with(
			when<string>((_) => RegExp(regex).test(_)),
			(_) => Option.some(RegExp(regex).exec(_)?.groups as unknown as T)
		)
		.otherwise(() => Option.none);
