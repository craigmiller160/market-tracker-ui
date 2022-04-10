import { Breadcrumb as AntBreadcrumb } from 'antd';
import './Breadcrumb.scss';

export const Breadcrumb = () => {
	return (
		<AntBreadcrumb className="MarketBreadcrumb">
			<AntBreadcrumb.Item>Hello</AntBreadcrumb.Item>
			<AntBreadcrumb.Item>World</AntBreadcrumb.Item>
		</AntBreadcrumb>
	);
};
