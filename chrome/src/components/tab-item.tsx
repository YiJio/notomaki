// packages
import React, { useState } from 'react';
// hooks
import { useTodoList } from '../contexts/todo.context';
// types
import { TodoList } from '../contexts/todo.context';
// components
import { TabPopup } from './popups/tab-popup';

export interface Tab {
	id: string;
	name: string;
	color: string;
	order: number;
}

interface TabItemProps {
	tabData: Tab;
}

export const TabItem = ({ tabData }: TabItemProps) => {
	const [showPopup, setShowPopup] = useState(false);
	const [coords, setCoords] = useState({ x: 0, y: 0 });
	const { activeTab, todoList, setActiveTab, setActiveList, setTodoList, handleUpdate } = useTodoList();

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		console.log(e);
		setCoords({ x: e.clientX, y: e.clientY });
		setShowPopup(true);
	}

	const handleMoveTab = (direction: 'up' | 'down') => {
		const updated = reorderTodoList(todoList, tabData.id, direction);
		setTodoList(updated);
	}

	const handleRenameTab = (name: string) => {
		handleUpdate('renameTab', { tabId: tabData.id, newName: name });
		setActiveTab(tabData.id);
		setActiveList('1');
	}

	return (
		<>
			<button onClick={() => setActiveTab(tabData.id)} onContextMenu={handleContextMenu} className={`nm-tab${activeTab === tabData.id ? ' nm-tab--active' : ''} nm-fg-${tabData.color}`}>
				<span>{tabData.name}</span>
			</button>
			{showPopup && (<TabPopup y={coords.y} tabId={tabData.id} tabName={tabData.name} onRename={handleRenameTab} closePopup={() => setShowPopup(false)} onMove={handleMoveTab} />)}
		</>
	);
}

function reorderTodoList(
	todoList: TodoList,
	tabId: string,
	direction: 'up' | 'down'
): TodoList {
	const entries = Object.entries(todoList);
	const sorted = entries.sort(([, a], [, b]) => a.order - b.order);
	const currentIndex = sorted.findIndex(([id]) => id === tabId);
	if (currentIndex === -1) return todoList;
	let newIndex: number;
	if (direction === 'up') {
		newIndex = currentIndex === 0 ? sorted.length - 1 : currentIndex - 1;
	} else {
		newIndex = currentIndex === sorted.length - 1 ? 0 : currentIndex + 1;
	}
	const reordered = [...sorted];
	const temp = reordered[currentIndex];
	reordered[currentIndex] = reordered[newIndex];
	reordered[newIndex] = temp;
	const updated: TodoList = {};
	reordered.forEach(([id, data], index) => {
		updated[id] = { ...data, order: index };
	});

	return updated;
}