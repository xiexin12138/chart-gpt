import { Callout, Card, Title } from "@tremor/react";
import axios from "axios";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { Chart } from "../components/ChartComponent";
import { Header } from "../components/Header";
import InfoSection from "../components/InfoSection";
import LoadingDots from "../components/LoadingDots";
import SquigglyLines from "../components/SquigglyLines";

const CHART_TYPES = [
	"area",
	"bar",
	"line",
	"composed",
	"scatter",
	"pie",
	"radar",
	"radialbar",
	"treemap",
	"funnel",
];

const HomePage = () => {
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [chartType, setChartType] = useState("");
	const [chartData, setChartData] = useState([]);
	const [error, setError] = useState(false);
	const [shouldRenderChart, setShouldRenderChart] = useState(false);

	const chartComponent = useMemo(() => {
		return <Chart data={chartData} chartType={chartType} />;
	}, [chartData, chartType]);

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();

		setError(false);
		setIsLoading(true);

		try {
			const chartTypeResponse = await axios.post("/api/get-type", {
				inputData: inputValue,
			});

			if (!CHART_TYPES.includes(chartTypeResponse.data.toLowerCase()))
				return setError(true);

			setChartType(chartTypeResponse.data);

			const libraryPrompt = `生成一个有效的JSON，其中每个元素都是一个对象。严格使用这个格式和命名：\n[{ \"name\": \"a\", \"value\": 12, \"color\": \"#4285F4\" }]，用于Recharts API。确保字段名始终命名为name。在JSON中，将value字段命名为基于用户度量的名称，而不是命名为value，默认使用中文。确保格式使用双引号，属性名是字符串字面量。\n\n${inputValue}\n 只提供JSON数据。`;

			const chartDataResponse = await axios.post("/api/parse-graph", {
				prompt: libraryPrompt,
			});

			let parsedData;

			try {
				parsedData = JSON.parse(chartDataResponse.data);
			} catch (error) {
				setError(true);
				console.error("解析图表数据失败:", error);
			}

			setChartData(parsedData);
			setChartType(chartTypeResponse.data);
			setShouldRenderChart(true);
		} catch (error) {
			setError(true);
			console.error("生成图表数据失败:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInputValue(event.target.value);
	};

	const handleCaptureClick = async (selector: string) => {
		const element = document.querySelector<HTMLElement>(selector);
		if (!element) {
			return;
		}
		const canvas = await html2canvas(element);
		const dataURL = canvas.toDataURL("image/png");
		downloadjs(dataURL, "chart.png", "image/png");
	};

	return (
		<div className='flex flex-col px-4 items-center justify-center bg-gradient-to-r from-slate-300 to-indigo-50 overflow-y-hidden'>
			<Header />
			<Head>
				<title>AI工具 - 文本转换为好看的图表</title>
			</Head>
			<Card className='w-full max-w-xl mb-6 space-6'>
				<form onSubmit={handleSubmit} className='w-full max-w-xl mb-1'>
					<div className='flex flex-col items-center justify-center'>
						<label
							htmlFor='textInput'
							className='block font-inter font-semibold text-gray-700 dark:text-gray-200'
						>
							 使用所需的图表类型描述您的数据。
							<SquigglyLines />
						</label>

						<textarea
							id='input'
							rows={3}
							placeholder='请用条形图展示数据，星期一-15人，星期二-3人，星期三-45人，星期四-124人，星期五-2人'
							className='appearance-none font-inter mt-8 border border-gray-300 dark:border-gray-600 shadow-sm flex flex-col items-center justify-center rounded-lg w-full max-w-md py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline text-left min-h-[120px] max-h-[200px]'
							value={inputValue}
							required
							autoFocus
							onChange={handleInputChange}
							onKeyDown={(event) => {
								if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
									handleSubmit(event);
								}
							}}
						/>

						<button
							type='submit'
							className='cursor-pointer font-inter font-semibold py-2 px-10 mt-10 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-row items-center justify-center'
						>
							绘制图表
						</button>
					</div>
				</form>
			</Card>
			{error ? (
				<Callout
					className='mb-6'
					title='Ooops! Could not generate'
					color='rose'
				>
					请稍后再试或重新构建您的请求。
				</Callout>
			) : (
				<div className='w-full max-w-xl mb-6 p-4'>
					{isLoading ? (
						<div className='flex items-center justify-center h-96'>
							<LoadingDots />
						</div>
					) : (
						shouldRenderChart && (
							<>
								<Card>
									<Title>{inputValue}</Title>
									{chartComponent}
								</Card>
								<div className='flex flex-col items-center justify-center p-4'>
									<button
										type='button'
										className='cursor-pointer font-inter font-semibold py-2 px-4 mt-10 rounded-full blue-button-w-gradient-border text-white text-shadow-0_0_1px_rgba(0,0,0,0.25) shadow-2xl flex flex-row items-center justify-center'
										onClick={() => handleCaptureClick(".recharts-wrapper")}
									>
										下载保存
									</button>
								</div>
							</>
						)
					)}
				</div>
			)}
			<InfoSection />
			<footer className='text-center font-inter text-gray-700 text-sm mb-4'>
			</footer>
		</div>
	);
};

export default HomePage;
