// packages
import React, { useEffect, useRef } from 'react';
// hooks
import { useTodoList } from '../contexts/todo.context';

export interface EditableLine {
	id: string;
	html: string;
	completed: boolean;
	indent: number;
}

interface EditableProps {
	id: string;
	html: string;
	completed: boolean;
	indent: number;
	setRef: (el: HTMLDivElement | null) => void;
	onInput: (id: string, html: string) => void;
	onBlur: (id: string, html:string) => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, id: string) => void;
	onPaste: (e: React.ClipboardEvent<HTMLDivElement>, id: string) => void;
	onToggle: (id: string) => void;
}


export const Editable = ({ id, html, completed, indent, setRef, onInput, onBlur, onKeyDown, onPaste, onToggle }: EditableProps) => {
	const localRef = useRef<HTMLDivElement>(null);
	const { activeTab, todoList } = useTodoList();
	const mark = todoList?.[activeTab]?.mark;
	const markInBox = ` nm-check__box--${mark}`;

	/*const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
		const text = e.clipboardData.getData('text/plain');
    const html = e.clipboardData.getData('text/html');
    if (text.includes('\n') || html.includes('<li>')) {
      e.preventDefault();
      onPaste(id, html, text);
    }
	}*/

	useEffect(() => {
		const el = localRef.current;
		if (el && el.innerHTML !== html) el.innerHTML = html;
		setRef(localRef.current);
	}, [html, setRef]);

	return (
		<div className={`nm-item nm-item--l${indent}`}>
			<div className='nm-check'>
				<div className={`nm-check__box${completed ? markInBox : ''}`} />
				<input type='checkbox' checked={completed} onChange={() => onToggle(id)} />
			</div>
			<div ref={localRef} className={`nm-item__input${completed ? ' nm-strikethrough' : ''}`} contentEditable suppressContentEditableWarning onInput={(e) => onInput(id, e.currentTarget.innerHTML)} onBlur={(e) => onBlur(id, e.currentTarget.innerHTML)} onKeyDown={(e) => onKeyDown(e, id)} onPaste={(e) => onPaste(e, id)} />
		</div>
	);
}
