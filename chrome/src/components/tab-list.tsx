import { useState } from 'react';
// contexts
import { useTodoList } from '../contexts/todo.context';
// components
import { TabItem } from './tab-item';

interface Tab {
	id: string;
	name: string;
	color: string;
}

export const TabList = () => {
	const { todoList, /*setTodoList*/ } = useTodoList();
	const tabs: Tab[] = Object.entries(todoList).map(([id, data]) => ({ id, name: data.name, color: data.color }));
	const [activeTab, setActiveTab] = useState<string>('1');

	return (
		<div className='nm-tabs'>
			<button className='nm-tab nm-tab--tool'><img src='assets/icon-up.png' /></button>
			<div className='nm-tabs__list'>
				{tabs.map((tab) => (
					<TabItem key={tab.id} tabData={tab} activeTab={activeTab} setActiveTab={setActiveTab} />
				))}
			</div>
			<button className='nm-tab nm-tab--tool'><img src='assets/icon-add.png' /></button>
			<button className='nm-tab nm-tab--tool'><img src='assets/icon-down.png' /></button>
		</div>
	);
}