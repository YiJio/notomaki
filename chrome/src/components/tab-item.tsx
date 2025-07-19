// packages
import React, { useEffect, useRef } from 'react';
// hooks
import { usePopup } from '../contexts/popup.context';
import { useTodoList } from '../contexts/todo.context';
// components
import { TabPopup } from './popups/tab-popup';

export interface Tab {
	id: string;
	name: string;
	color: string;
	mark?: string;
}

interface TabItemProps {
	id?: string;
	tabData: Tab;
	currentPage: number;
	onMove: (id: string, direction: string) => void;
}

export const TabItem = ({ tabData, currentPage, onMove }: TabItemProps) => {
	const { openPopup, closePopup } = usePopup();
	const { activeTab, setActiveTab, setActiveList, tabPopupOpen, setTabPopupOpen, hasUnsaved, todoList, getFirstListId, handleSaveToStorage, handleUpdate } = useTodoList();
	const tabRef = useRef<HTMLButtonElement | null>(null);

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		if (hasUnsaved) { handleSaveToStorage('tab contextmenu'); }
		setTimeout(() => {
			setActiveTab(tabData.id);
			setActiveList(getFirstListId(tabData.id));
			setTabPopupOpen(tabData.id);
			//const x = e.clientX;
			//const y = e.clientY;
			if (tabRef.current) {
				const node = e.target as HTMLElement;
				const x = 40;
				const y = node.getBoundingClientRect().top - 8;
				openPopup(<TabPopup tabId={tabData.id} tabName={tabData.name} onRename={handleRenameTab} onMove={(direction) => onMove(tabData.id, direction)} />, x, y, 'tab');
			}
		}, 100);
	}

	const handleClickTab = () => {
		if (hasUnsaved) { handleSaveToStorage('tab change'); }
		setTimeout(() => {
			setActiveTab(tabData.id);
			setActiveList(getFirstListId(tabData.id));
		}, 200);
	}

	const handleRenameTab = (name: string) => {
		handleUpdate('renameTab', { tabId: tabData.id, newName: name });
	}

	useEffect(() => {
		if (tabRef.current && tabPopupOpen === tabData.id) {
			// continue the popup when ordering happened in todolist
			tabRef.current.oncontextmenu;
			const node = tabRef.current;
			const x = 40;
			const y = node.getBoundingClientRect().top - 8;
			closePopup();
			//console.log("working on", tabData.id, tabData.name);
			openPopup(<TabPopup tabId={tabData.id} tabName={tabData.name} onRename={handleRenameTab} onMove={(direction) => onMove(tabData.id, direction)} />, x, y, 'tab');
		}
	}, [tabRef, currentPage, todoList]);

	return (
		<>
			<button ref={tabRef} onClick={handleClickTab} onContextMenu={handleContextMenu} className={`nm-tab${activeTab === tabData.id ? ' nm-tab--active' : ''} nm-fg-${tabData.color}`}>
				<span>{tabData.name}</span>
			</button>
		</>
	);
}