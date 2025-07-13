// packages
import React, { useState } from 'react';

interface TooltipProps {
	position: 'left' | 'right';
	offset?: number;
	trigger: React.ReactNode;
	text: string;
}

export const Tooltip = ({ position, offset = 36, trigger, text }: TooltipProps) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div style={{ position: 'relative' }}>
			<div className='nm-tooltip__trigger' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>{trigger}</div>
			<div className={`nm-tooltip nm-tooltip--${position}`} style={{ right: position === 'left' && isHovered ? `${offset}px` : '', left: position === 'right' && isHovered ? `${offset}px` : '' }}>
				<div className='nm-tooltip__wrapper'>{text}</div>
			</div>
		</div>
	);
}