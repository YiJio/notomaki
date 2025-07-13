// packages
import React, { useCallback, useEffect, useRef, useState } from 'react';
// hooks
import { useTabPagination } from '../hooks/use-tab-pagination';
import { useModal } from '../contexts/modal.context';
import { useTodoList } from '../contexts/todo.context';
// types
import { Tab } from './tab-item';
// components
import { TabItem } from './tab-item';
import { AddTabDialog } from './dialogs/add-tab-dialog';

export const TabList = React.memo(() => {
	const { activeTab, todoList } = useTodoList();
	const { openModal } = useModal();
	//const tabs: Tab[] = Object.entries(todoList).sort(([, a], [, b]) => a.order - b.order).map(([id, data]) => ({ id, name: data.name, color: data.color }));
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

	useEffect(() => {
		setCurrentPage(activePageIndex);
	}, [activePageIndex]);

	const visibleTabs = getTabsForPage(currentPage);

	return (
		<div ref={listRef} className='nm-tabs'>
			<button onClick={() => handleChangePage(0)} className='nm-tab nm-tab--tool'>
				<img src='assets/icon-up.png' />
			</button>
			<div className='nm-tabs__list'>
				{visibleTabs.map((tab) => (
					<TabItem key={tab.id} tabData={tab} />
				))}
			</div>
			<button onClick={handleClickAdd} className='nm-tab nm-tab--tool'>
				<img src='assets/icon-add.png' />
			</button>
			<button onClick={() => handleChangePage(1)} className='nm-tab nm-tab--tool'>
				<img src='assets/icon-down.png' />
			</button>
		</div>
	);
});