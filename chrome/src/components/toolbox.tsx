// packages
//import React from 'react';
// components
import { Swatch } from './swatch';

interface ToolboxProps {
	type: string;
}

export const Toolbox = ({ type }: ToolboxProps) => {
	// change color and note type onclicks

	return (
		<div className='nm-toolbox'>
			{type === 'swatches' ? <>
				<Swatch color='o' inToolbox />
				<Swatch color='y' inToolbox />
				<Swatch color='g' inToolbox />
				<Swatch color='m' inToolbox />
				<Swatch color='b' inToolbox />
				<Swatch color='p' inToolbox />
			</> : <>
				<button><img src='assets/icon-line-solid@3x.png' /></button>
				<button><img src='assets/icon-line-dot@3x.png' /></button>
				<button><img src='assets/icon-grid-dot@3x.png' /></button>
				<button><img src='assets/icon-grid-dash@3x.png' /></button>
				<button><img src='assets/icon-grid-solid@3x.png' /></button>
			</>}
		</div>
	);
}