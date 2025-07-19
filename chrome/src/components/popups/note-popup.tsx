// packages
//import { useState } from 'react';
// hooks
import { usePopup } from '../../contexts/popup.context';
import { useTodoList } from '../../contexts/todo.context';
// components

export const NotePopup = () => {
	const { closePopup } = usePopup();
	const { activeTab, activeList, todoList, setActiveList } = useTodoList();
	const activeColor = todoList?.[activeTab]?.color;
	const lists = Object.entries(todoList?.[activeTab]?.lists).map(([id, data]) => ({ id, name: data.name, updated: data.updated }));

	const handleClick = (listId: string) => {
		setActiveList(listId);
		closePopup();
	}

	return (
		<>
			{lists.map((list) => (
				<div key={list.id} onClick={() => handleClick(list.id)} className={`nm-popup__option${activeList === list.id ? ' active' : ''}`}>
					<strong>{list.name}</strong>
					<span>{list.updated}</span>
					<div className={`nm-popup__overlay nm-mg-${activeColor}`} />
				</div>
			))}
		</>
	);
}