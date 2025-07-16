// packages
import { useCallback, useEffect, useRef, useState } from 'react';
// hooks
import { useModal } from '../contexts/modal.context';
import { useTabPagination } from '../hooks/use-tab-pagination';
import { useTodoList } from '../contexts/todo.context';
// types
import { Tab } from './tab-item';
import { TodoList } from '../contexts/todo.context';
// components
import { TabItem } from './tab-item';
import { AddTabDialog } from './dialogs';

export const TabList = () => {
	const { activeTab, todoList, setTodoList } = useTodoList();
	const { openModal } = useModal();
	const [currentPage, setCurrentPage] = useState(0);
	const listRef = useRef<HTMLDivElement | null>(null);

	const getTabHeight = useCallback((name: string) => {
		const tempDiv = document.createElement('button');
		tempDiv.className = 'nm-tab';
		const tempSpan = document.createElement('span');
		tempSpan.textContent = name;
		tempDiv.appendChild(tempSpan);
		tempDiv.style.position = 'absolute';
		tempDiv.style.visibility = 'hidden';
		document.body.appendChild(tempDiv);
		const height = tempDiv.offsetHeight;
		document.body.removeChild(tempDiv);
		return height;
	}, []);

	const getTabsForPage = (pageIndex: number): Tab[] => {
		const start = tabsPerPage.slice(0, pageIndex).reduce((sum: number, num: number) => sum + num, 0);
		const count = tabsPerPage[pageIndex];
		return sortedTabs.slice(start, start + count);
	}

	const { tabsPerPage, activePageIndex, sortedTabs } = useTabPagination(todoList, listRef, getTabHeight, activeTab);

	const handleClickAdd = () => {
		openModal(<AddTabDialog />);
	}

	const handleChangePage = (mode: number) => {
		if (mode === 0) {
			setCurrentPage((prev) => prev === 0 ? tabsPerPage.length - 1 : prev - 1);
		} else {
			setCurrentPage((prev) => (prev + 1) % tabsPerPage.length);
		}
	}

	const handleMoveTab = (tabId: string, direction: string) => {
		//console.log('tab', tabId, 'should be moved', direction);
		//console.log('dealing with', todoList);
		const entries = Object.entries(todoList)
			.map(([id, data]) => ({ id, ...data }))
			.sort((a, b) => a.order - b.order);
		const index = entries.findIndex(tab => tab.id === tabId);
		//console.log('--------\nAttempt PRINTING', entries)
		const maxIndex = entries.length - 1;
		const newIndex = direction === 'up' ? index === 0 ? maxIndex : index - 1 : index === maxIndex ? 0 : index + 1;
		// swap two tabs
		const temp = entries[index].order;
		entries[index].order = entries[newIndex].order;
		entries[newIndex].order = temp;
		// rebuild list with updated orders
		const reordered: TodoList = {};
		for (const tab of entries) {
			reordered[tab.id] = { ...todoList[tab.id], order: tab.order };
		}
		//console.log('trying to reorder', reordered);
		setTodoList(reordered);
	}

	useEffect(() => {
		setCurrentPage(activePageIndex);
	}, [activePageIndex]);

	const visibleTabs = getTabsForPage(currentPage);

	return (
		<div ref={listRef} className='nm-tabs nm-layer'>
			<button onClick={() => handleChangePage(0)} className='nm-tab nm-tab--tool' disabled={tabsPerPage.length === 1}>
				<img src='assets/icon-up.png' />
			</button>
			<div className='nm-tabs__list'>
				{visibleTabs.map((tab) => (
					<TabItem key={tab.id} tabData={tab} onMove={handleMoveTab} currentPage={currentPage} />
				))}
			</div>
			<button onClick={handleClickAdd} className='nm-tab nm-tab--tool'>
				<img src='assets/icon-add.png' />
			</button>
			<button onClick={() => handleChangePage(1)} className='nm-tab nm-tab--tool' disabled={tabsPerPage.length === 1}>
				<img src='assets/icon-down.png' />
			</button>
			<button className='nm-tab nm-tab--tool' disabled>
				<span>{currentPage + 1}/{tabsPerPage.length}</span>
			</button>
		</div>
	);
}