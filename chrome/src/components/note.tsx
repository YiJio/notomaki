// packages
import { useEffect, useRef, useState } from 'react';
// hooks
import { useTodoList } from '../contexts/todo.context';
// components
import { EditHeading } from './edit-heading';
import { Editor } from './editor';
import { NavNoteButton } from './buttons';

export const Note = () => {
	const { activeTab, activeList, todoList, handleUpdate } = useTodoList();
	const textRef = useRef<HTMLTextAreaElement>(null);
	const [listName, setListName] = useState<string>(todoList?.[activeTab]?.lists?.[activeList]?.name);
	const [heading, setHeading] = useState<string>(todoList?.[activeTab]?.lists?.[activeList]?.heading);
	const activeColor = todoList?.[activeTab]?.color;

	const handleRenameList = () => {
		handleUpdate('renameList', { tabId: activeTab, listId: activeList, newName: listName });
	}

	const handleChangeHeading = () => {
		handleUpdate('changeHeading', { tabId: activeTab, listId: activeList, newName: heading });
	}

	useEffect(() => {
		if (activeTab && activeList) {
			const newName: string = todoList?.[activeTab].lists?.[activeList].name;
			setListName(newName);
		}
	}, [activeTab, activeList]);

	useEffect(() => {
		if (textRef.current) {
			textRef.current.style.height = '20px';
			const scrollHeight = textRef.current.scrollHeight;
			textRef.current.style.height = `${scrollHeight}px`;
		}
	}, [textRef.current, listName]);

	return (
		<div className='nm-content'>
			<header className={`nm-content__header nm-mg-${activeColor}`}>
				<NavNoteButton direction='left' />
				<div className='nm-content__title'>
					<strong className='nm-content__tab nm-layer'>{todoList?.[activeTab]?.name}</strong>
					/
					<textarea ref={textRef} className='nm-content__input nm-layer' value={listName} onChange={(e) => setListName(e.target.value)} onBlur={handleRenameList} maxLength={100} placeholder='Untitled note' />
				</div>
				<NavNoteButton direction='right' />
			</header>
			<div className={`nm-content__body nm-bg-${activeColor}`}>
				<div className='nm-note nm-layer'>
					<EditHeading onChange={(value) => setHeading(value)} onBlur={handleChangeHeading} />
					<Editor items={todoList?.[activeTab]?.lists?.[activeList]?.items} />
				</div>
			</div>
		</div>
	);
}