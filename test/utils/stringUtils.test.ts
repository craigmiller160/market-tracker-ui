import { describe, it, expect } from 'vitest';
import { toNameCase } from '../../src/utils/stringUtils';

describe('stringUtils', () => {
	describe('toNameCase', () => {
		it('all upper case', () => {
			expect(toNameCase('HELLO')).toEqual('Hello');
		});

		it('all lower case', () => {
			expect(toNameCase('hello')).toEqual('Hello');
		});

		it('already name case', () => {
			expect(toNameCase('Hello')).toEqual('Hello');
		});

		it('empty string', () => {
			expect(toNameCase('')).toEqual('');
		});
	});
});
