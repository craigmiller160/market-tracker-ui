import { ReactNode } from 'react';
import { match, when } from 'ts-pattern';
import { Navigate, Route } from 'react-router-dom';

export interface RuleV2<RuleProps extends object> {
	allow: (ruleProps: RuleProps) => boolean;
	redirect: string;
}

// TODO delete if unused

interface Props<RuleProps extends object> {
	path: string;
	ruleProps: RuleProps;
	rules: RuleV2<RuleProps>[];
	element: ReactNode;
}

const isNotUndefined = <T extends object>(value: T | undefined): boolean =>
	value !== undefined;

export const ProtectedRouteV2 = <RuleProps extends object>(
	props: Props<RuleProps>
) => {
	const { path, ruleProps, rules, element } = props;

	const failedRule: RuleV2<RuleProps> | undefined = rules.find(
		(rule) => !rule.allow(ruleProps)
	);
	return match(failedRule)
		.with(when(isNotUndefined), (_: RuleV2<RuleProps>) => (
			<Navigate to={_.redirect} />
		))
		.otherwise(() => <Route path={path} element={element} />);
};
