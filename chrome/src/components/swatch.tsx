//import React from 'react';

interface SwatchProps {
	inToolbox?: boolean;
	color: string;
}

export const Swatch = ({ inToolbox = false, color = 'o' }: SwatchProps) => {
	return (
		<button className={`nm-swatch${inToolbox ? ' nm-swatch--toolbox' : ''} nm-fg-${color}`}></button>
	);
}