// packages
//import React from 'react';
// hooks
import { useTodoList } from '../contexts/todo.context';
// components
import { Swatch } from './swatch';
import { Tooltip } from './tooltip';

interface ToolboxProps {
	type: string;
}

// constants
export const SWATCH_COLORS = [
	{ key: 'o', value: 'orange' },
	{ key: 'y', value: 'yellow' },
	{ key: 'g', value: 'green' },
	{ key: 'm', value: 'mint' },
	{ key: 'b', value: 'blue' },
	{ key: 'p', value: 'purple' }
];
export const NOTE_TYPES = [
	/*{ key: 'line-solid', value: 'solid line', short: 'ls' },
	{ key: 'line-dot', value: 'dotted line', short: 'ldo' },*/
	{ key: 'grid-dot', value: 'dotted grid', short: 'gdo' },
	{ key: 'grid-dash', value: 'dashed grid', short: 'gda' },
	{ key: 'grid-solid', value: 'solid grid', short: 'gs' }
];

export const Toolbox = ({ type }: ToolboxProps) => {
	// change color and note type onclicks
	const { activeTab, activeList, todoList, handleUpdate } = useTodoList();

	const activeColor = todoList?.[activeTab]?.color || 'o';
	const activeNote = todoList?.[activeTab]?.lists?.[activeList].note || 'line-solid';

	const handleChangeColor = (color: string) => {
		handleUpdate('changeColor', { tabId: activeTab, newColor: color });
	}

	const handleChangeNote = (note: string) => {
		handleUpdate('changeNote', { tabId: activeTab, listId: activeList, newNote: note });
	}


	return (
		<div className='nm-toolbox'>
			{type === 'swatches' ? <>
				{SWATCH_COLORS.map((color, index) => (
					<Tooltip key={index} position='left' offset={28} trigger={<Swatch color={color.key} activeColor={activeColor} onChange={handleChangeColor} inToolbox />} text={color.value} />
				))}
			</> : <>
				{NOTE_TYPES.map((note, index) => (
					<Tooltip key={index} position='left' trigger={<button onClick={() => handleChangeNote(note.key)}>
						<img className={`nm-toolbox__img${activeNote === note.key ? ' nm-toolbox__img--active' : ''}`} src={`assets/icon-${note.key}@3x.png`} />
					</button>} text={note.value} />
				))}
			</>}
		</div>
	);
}