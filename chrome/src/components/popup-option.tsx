// packages
import { useEffect, useState } from 'react';
import { isThisWeek, isThisYear, isToday, isYesterday } from 'date-fns';
// utils
import { getLocalization, getLocalizationDateTime } from '../utils';
// hooks
import { useTodoList } from '../contexts/todo.context';
// constants
import { LAST_PATCH_TIMESTAMP } from '../constants';

interface PopupOptionProps {
	listId: string;
	listName: string;
	listDate: number | undefined;
	onClose: () => void;
}

export const PopupOption = ({ listId, listName, listDate, onClose }: PopupOptionProps) => {
	const [lastUpdated, setLastUpdated] = useState<string>('');
	const { lang, activeTab, activeList, setActiveList, todoList } = useTodoList();
	const activeColor = todoList?.[activeTab]?.color;

	const handleClick = () => {
		setActiveList(listId);
		onClose();
	}

	const getLastUpdatedDisplay = (timestamp: number | undefined) => {
		const date = new Date(timestamp || LAST_PATCH_TIMESTAMP);
		const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
		if (isToday(date)) {
			return getLocalization(lang, 't-today_at', timeString);
		} else if (isYesterday(date)) {
			return getLocalization(lang, 't-yesterday_at', timeString);
		} else if (isThisWeek(date, { weekStartsOn: 0 })) {
			return getLocalizationDateTime(lang, 'week', date);
		} else if (isThisYear(date)) {
			return getLocalizationDateTime(lang, 'this-year', date);
		} else {
			return getLocalizationDateTime(lang, 'year', date);
		}
	}

	useEffect(() => {
		if (listDate) {
			const updatedString = getLastUpdatedDisplay(listDate);
			setLastUpdated(updatedString);
		}
	}, [listDate]);

	return (
		<div onClick={handleClick} className={`nm-popup__option${activeList === listId ? ' active' : ''}`}>
			<strong>{listName === '' ? getLocalization(lang, 't-untitled_note_ph') : listName}</strong>
			<span>{lastUpdated}</span>
			<div className={`nm-popup__options__bg nm-bg-${activeColor}`} />
			<div className={`nm-popup__options__mg nm-mg-${activeColor}`} />
		</div>
	);
}