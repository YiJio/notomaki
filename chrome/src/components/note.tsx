// packages
import { useEffect, useRef, useState } from 'react';
// utils
import { getDateTime, getLocalization } from '../utils';
// hooks
import { useTodoList } from '../contexts/todo.context';
// components
import { Editor } from './editor';
import { NavNoteButton, NoteMenuButton } from './buttons';
// constants
import { LAST_PATCH_TIMESTAMP } from '../constants';

export const Note = () => {
	const { lang, activeTab, activeList, todoList, handleUpdate } = useTodoList();
	const nameRef = useRef<HTMLTextAreaElement>(null);
	const headingRef = useRef<HTMLTextAreaElement>(null);
	const [listName, setListName] = useState<string>(todoList?.[activeTab]?.lists?.[activeList]?.name);
	const [heading, setHeading] = useState<string>(todoList?.[activeTab]?.lists?.[activeList]?.heading);
	const activeColor = todoList?.[activeTab]?.color;
	const lastUpdated = todoList?.[activeTab]?.lists?.[activeList]?.updated || LAST_PATCH_TIMESTAMP;
	const lastUpdatedDate = getDateTime(lang, lastUpdated);

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
			const newHeading: string = todoList?.[activeTab].lists?.[activeList].heading;
			setHeading(newHeading);
			//console.log(todoList, todoList?.[activeTab], 'listname', newName, 'heading', newHeading)
		}
	}, [activeTab, activeList]);

	useEffect(() => {
		if (nameRef.current) {
			nameRef.current.style.height = '20px';
			const scrollHeight = nameRef.current.scrollHeight;
			nameRef.current.style.height = `${scrollHeight}px`;
		}
	}, [nameRef.current, listName]);

	useEffect(() => {
		if (headingRef.current) {
			headingRef.current.style.height = '32px';
			const scrollHeight = headingRef.current.scrollHeight;
			headingRef.current.style.height = `${scrollHeight}px`;
		}
	}, [headingRef.current, heading]);

	return (
		<div className='nm-content'>
			<header className={`nm-content__header nm-mg-${activeColor}`}>
				<NavNoteButton direction='left' />
				<NoteMenuButton />
				<div className='nm-content__title'>
					<strong className='nm-content__tab nm-layer'>{todoList?.[activeTab]?.name}</strong>
					/
					<textarea ref={nameRef} className='nm-content__input nm-layer' value={listName} onChange={(e) => setListName(e.target.value)} onBlur={handleRenameList} maxLength={100} placeholder={getLocalization(lang, 't-untitled_note_ph')} />
				</div>
				<NavNoteButton direction='right' />
			</header>
			<div className={`nm-content__body nm-bg-${activeColor}`}>
				<div className='nm-note nm-layer'>
					<div className='nm-note__updated'>{getLocalization(lang, 't-last_updated')}{lastUpdatedDate}</div>
					<textarea ref={headingRef} className='nm-note__heading' value={heading} onChange={(e) => setListName(e.target.value)} onBlur={handleChangeHeading} placeholder={getLocalization(lang, 't-untitled_heading_ph')} />
					<Editor items={todoList?.[activeTab]?.lists?.[activeList]?.items} />
				</div>
			</div>
		</div>
	);
}