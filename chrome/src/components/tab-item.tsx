// packages
import React, { useState } from 'react';
// contexts
import { useTodoList } from '../contexts/todo.context';
// components
import { RenamePopup } from './popups/rename-popup';

interface TabProps {
	id: string;
	name: string;
	color: string;
}

interface TabItemProps {
	tabData: TabProps;
	activeTab: string;
	setActiveTab: (tab: string) => void;
}

export const TabItem = ({ tabData, activeTab, setActiveTab }: TabItemProps) => {
	const [showPopup, setShowPopup] = useState(false);
	//const [coords, setCoords] = useState({ x: 0, y: 0 });
	const { handleUpdate } = useTodoList();

	const handleContextMenu = (e: React.MouseEvent) => {
		e.preventDefault();
		console.log(e);
		//setCoords({ x: e.clientX, y: e.clientY });
		setShowPopup(true);
	}

	const handleRename = (name: string) => {
		handleUpdate('renameTab', { tabId: tabData.id, newName: name });
	}

	return (
		<>
			<button onClick={() => setActiveTab(tabData.id)} onContextMenu={handleContextMenu} className={`nm-tab${activeTab === tabData.id ? ' nm-tab--active' : ''} nm-fg-${tabData.color}`}>
				<span>{tabData.name}</span>
			</button>
			{showPopup && (<RenamePopup tabName={tabData.name} setTabName={handleRename} closePopup={() => setShowPopup(false)} />)}
		</>
	);
}