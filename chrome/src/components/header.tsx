// packages
//import { useState } from 'react';
// hooks
import { useTodoList } from '../contexts/todo.context';

export const Header = () => {
	const { lang, setLang } = useTodoList();

	const handleToggleLang = () => {
		const currLang = lang;
		let newLang = currLang || 'en';
		if(currLang === 'en') { newLang = 'ja'; }
		else if(currLang === 'ja') { newLang = 'zh'; }
		else if(currLang === 'zh') { newLang = 'en'; }
		setLang(newLang);
	}

	return (
		<header className='nm-header nm-layer'>
			<img className='nm-header__logo' src='assets/maki-1.png' />
			<h1 onClick={handleToggleLang} className={`nm-header__title nm-header__title--${lang}`}>
				{lang === 'en' && 'noto maki'}
				{lang === 'ja' && 'ノート 巻'}
				{lang === 'zh' && '笔 记 卷'}
			</h1>
		</header>
	);
}