// packages
import { useState } from 'react';

export const Header = () => {
	const [toggleEn, setToggleEn] = useState(false);

	return (
		<header className='nm-header nm-layer'>
			<img className='nm-header__logo' src='assets/maki-1.png' />
			<h1 onClick={() => setToggleEn(prev => !prev)} className={`nm-header__title${toggleEn ? ' nm-header__title--en' : ''}`}>
				{toggleEn ? 'noto maki' : 'ノート 巻'}
			</h1>
		</header>
	);
}