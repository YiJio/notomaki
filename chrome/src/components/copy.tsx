// components
import { Tooltip } from './tooltip';

export const Copy = () => {
	return (
		<div className='nm-copy'>
			<Tooltip position='right' offset={32} trigger={<>
				{/*<div className='nm-copy__circle'>©</div>*/}
				<img src='assets/copy@2x.png' />
			</>} text='© 2025 YiJio' />
		</div>
	);
}