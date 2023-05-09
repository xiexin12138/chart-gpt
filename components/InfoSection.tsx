// components/InfoSection.tsx
import { Card, Text, Title } from "@tremor/react";
import React, { ReactNode } from "react";

const ListItem = ({ children }: { children: ReactNode }) => (
	<li className='text-gray-500 text-sm font-normal'>{children}</li>
);

const InfoSection: React.FC = () => {
	return (
		<Card className='max-w-xl mb-8 dark:bg-gray-800'>
			<Title className='bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text text-transparent font-bold sm:text-xl text-2xl mb-4'>
				怎么使用这个工具
			</Title>
			<Text>
				要开始使用，只需在输入框中输入您的数据描述和所需的单一图表类型。我们的生成器将在几秒钟内为您创建图表！
			</Text>
			<h3 className='text-xl mt-6 mb-4 font-inter font-bold sm:text-xl flex items-center bg-gradient-to-r from-sky-400 via-violet-600 to-rose-500 bg-clip-text text-transparent'>
				支持的图表类型
			</h3>
			<ul className='text-left list-disc pl-6 text-gray-700 dark:text-gray-300 marker:text-sky-400'>
				<ListItem>面积图 ( Area Chart )</ListItem>
				<ListItem>条形图 ( Bar Chart )</ListItem>
				<ListItem>折线图 ( Line Chart )</ListItem>
				<ListItem>组合图表 ( Composed Chart )</ListItem>
				<ListItem>散点图 ( Scatter Chart )</ListItem>
				<ListItem>饼图 ( Pie Chart )</ListItem>
				<ListItem>雷达图 ( Radar Chart )</ListItem>
				<ListItem>径向条形图 ( Radial Bar Chart )</ListItem>
				<ListItem>树状图 ( Treemap )</ListItem>
				<ListItem>漏斗图 ( Funnel Chart )</ListItem>
			</ul>
		</Card>
	);
};

export default InfoSection;
