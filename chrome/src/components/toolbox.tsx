// packages
//import React from 'react';
// hooks
import { useTodoList } from '../contexts/todo.context';
// components
import { Swatch } from './swatch';
import { Tooltip } from './tooltip';
// constants
import { MARKS, NOTE_TYPES, SWATCH_COLORS } from '../constants';

interface ToolboxProps {
	type: 'notes' | 'swatches' | 'marks';
}

export const Toolbox = ({ type }: ToolboxProps) => {
	// change color and note type onclicks
	const { activeTab, activeList, todoList, handleUpdate } = useTodoList();

	const activeColor = todoList?.[activeTab]?.color || 'o';
	const activeMark = todoList?.[activeTab]?.mark || 'x';
	const activeNote = todoList?.[activeTab]?.lists?.[activeList]?.note || 'grid-dot';

	const handleChangeNote = (note: string) => {
		handleUpdate('changeNote', { tabId: activeTab, listId: activeList, newNote: note });
	}

	const handleChangeColor = (color: string) => {
		handleUpdate('changeColor', { tabId: activeTab, newColor: color });
	}

	const handleChangeMark = (mark: string) => {
		handleUpdate('changeMark', { tabId: activeTab, newMark: mark });
	}


	return (
		<div className='nm-toolbox'>
			{type === 'notes' && <>
				{NOTE_TYPES.map((note, index) => (
					<Tooltip key={index} position='left' trigger={<button onClick={() => handleChangeNote(note.key)}>
						<img className={`nm-toolbox__img${activeNote === note.key ? ' nm-toolbox__img--active' : ''}`} src={`assets/icon-${note.key}@3x.png`} />
					</button>} text={note.value} />
				))}
			</>}
			{type === 'swatches' && <>
				{SWATCH_COLORS.map((color, index) => (
					<Tooltip key={index} position='left' offset={28} trigger={<Swatch color={color.key} activeColor={activeColor} onChange={handleChangeColor} inToolbox />} text={color.value} />
				))}
			</>}
			{type === 'marks' && <>
				{MARKS.map((mark, index) => (
					<Tooltip key={index} position='left' trigger={<button onClick={() => handleChangeMark(mark.key)}>
						<img className={`nm-toolbox__img${activeMark === mark.key ? ' nm-toolbox__img--active' : ''}`} src={`assets/checked-${mark.key}.png`} />
					</button>} text={mark.value} />
				))}
			</>}
		</div>
	);
}