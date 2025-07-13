//import React from 'react';

interface SwatchProps {
	inToolbox?: boolean;
	color: string;
	activeColor?: string;
	onChange?: (color: string) => void;
}

export const Swatch = ({ inToolbox = false, color = 'o', activeColor, onChange }: SwatchProps) => {

	const handleChange = (color: string) => {
		onChange && onChange(color);
	}

	return (
		<button onClick={() => handleChange(color)} className={`nm-swatch${inToolbox ? ' nm-swatch--toolbox' : ''}${activeColor && activeColor === color ? ' nm-swatch--active' : ''} nm-fg-${color}`}></button>
	);
}