// packages
import React, { useCallback, useEffect, useRef, useState } from 'react';
// hooks
import { useModal } from '../contexts/modal.context';
import { useTodoList } from '../contexts/todo.context';
// components
import { TabItem } from './tab-item';
import { AddTabDialog } from './dialogs/add-tab-dialog';
import { useTabPaginationWithActivePage } from '../hooks/use-tab-pagination';

interface Tab {
	id: string;
	name: string;
	color: string;
	order: number;
}

export const TabList = React.memo(() => {
	const { activeTab, todoList } = useTodoList();
	const { openModal } = useModal();
	//const tabs: Tab[] = Object.entries(todoList).sort(([, a], [, b]) => a.order - b.order).map(([id, data]) => ({ id, name: data.name, color: data.color }));
	const [currentPage, setCurrentPage] = useState(0);
	//const [tabsPerPage, setTabsPerPage] = useState<number[]>([]);
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

	const { tabsPerPage, activePageIndex, sortedTabs } = useTabPaginationWithActivePage(todoList, listRef, getTabHeight, activeTab);

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

	/*const calculateTabsPerPage = useCallback((page: number) => {
		console.log('is trying to calculate')
		if (!listRef.current || page > tabsPerPage.length) return;
		const listHeight = listRef.current.clientHeight;
		let currentTabsPerPage = 0;
		let totalHeight = 120;
		let start = page === 0 ? 0 : tabsPerPage.slice(0, page).reduce((sum, num) => sum + num, 0);
		for (let i = start; i < tabs.length; i++) {
			const tabHeight = getTabHeight(tabs[i].name);
			const nextHeight = totalHeight + tabHeight + 2;
			console.log(i, tabs[i].name, ':', tabHeight, '=', nextHeight)
			if (nextHeight <= listHeight) {
				totalHeight = nextHeight;
				currentTabsPerPage++;
			} else { break; }
		}
		setTabsPerPage(prev => {
			const newTabs = [...prev];
			newTabs[page] = currentTabsPerPage;
			return newTabs;
		});
	}, [listRef, tabsPerPage, tabs]);

	const calculateRemainingTabs = (): number => {
		let remainingTabs = tabs.length;
		for (let i = 0; i <= currentPage; i++) {
			remainingTabs -= tabsPerPage[i] || 0;
		}
		return remainingTabs;
	}

	useEffect(() => {
		if (listRef.current) {
			console.log('calc when listref')
			calculateTabsPerPage(0);
		}
	}, [listRef, todoList]);

	useEffect(() => {
		console.log('tabsinpage:', tabsPerPage)
	}, [tabsPerPage]);*/


	/*useEffect(() => {
		console.log('calc when page change')
		console.log('1now on page',currentPage)
		calculateTabsPerPage(currentPage);
		console.log('2now on page',currentPage)
	}, [currentPage]);*/

	/*useEffect(() => {
		console.log(activeTab, tabs)
		calculateTabsPerPage();
		const index = tabs.findIndex(tab => tab.id === activeTab);
		console.log('active tab index', index);
		if (index !== -1) {
			const newPage = Math.floor(index / tabsPerPage[0]);
			console.log('should be in page ', newPage)
			setCurrentPage(newPage);
		}
	}, [setActiveTab, activeTab]);*/

	useEffect(() => {
		setCurrentPage(activePageIndex);
	}, [activePageIndex]);

	//const visibleStart = currentPage === 0 ? 0 : tabsPerPage.slice(0, currentPage).reduce((sum, num) => sum + num, 0);
	//const visibleEnd = visibleStart + tabsPerPage[currentPage];
	//const visibleTabs = tabs.slice(visibleStart, visibleEnd);
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