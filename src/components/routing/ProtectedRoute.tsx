import { ReactNode } from 'react';
import { match, when } from 'ts-pattern';
import { Navigate, Route } from 'react-router-dom';

export interface Rule<RuleProps extends object> {
	allow: (ruleProps: RuleProps) => boolean;
	redirect: string;
}

interface Props<RuleProps extends object> {
	path: string;
	ruleProps: RuleProps;
	rules: Rule<RuleProps>[];
	element: ReactNode;
}

const isNotUndefined = <T extends object>(value: T | undefined): boolean =>
	value !== undefined;

export const ProtectedRoute = <RuleProps extends object>(
	props: Props<RuleProps>
) => {
	const { path, ruleProps, rules, element } = props;

	const failedRule: Rule<RuleProps> | undefined = rules.find(
		(rule) => !rule.allow(ruleProps)
	);
	return match(failedRule)
		.with(when(isNotUndefined), (_: Rule<RuleProps>) => (
			<Navigate to={_.redirect} />
		))
		.otherwise(() => <Route path={path} element={element} />);
};
