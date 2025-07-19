// packages
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
// hooks
import { useTodoList } from './todo.context';

interface PopupProps {
	x: number;
	y: number;
	name: string;
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

interface PopupContextType {
	openPopup: (popupContent: React.ReactNode, x: number, y: number, name: string) => void;
	closePopup: () => void;
	popupProps: PopupProps;
}

const PopupContext = createContext<PopupContextType | null | undefined>(undefined);

export function usePopup(): PopupContextType {
	const context = useContext(PopupContext);
	if (context === undefined || context === null) {
		throw new Error('usePopup must be used within a PopupProvider');
	}
	return context;
}

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);
	const [name, setName] = useState<string>('');
	const [isOpen, setIsOpen] = useState(false);
	const [popupContent, setPopupContent] = useState<React.ReactNode>(null);

	const openPopup = (content: React.ReactNode, x: number, y: number, name: string) => {
		setX(x);
		setY(y);
		setName(name);
		setPopupContent(content);
		setIsOpen(true);
	}

	const closePopup = () => {
		setX(0);
		setY(0);
		setName('');
		setPopupContent(null);
		setIsOpen(false);
	}

	const popupProps = { x, y, name, isOpen, onClose: closePopup, children: popupContent };

	return (
		<PopupContext.Provider value={{ openPopup, closePopup, popupProps }}>
			{children}
			<PopupPortal />
		</PopupContext.Provider>
	);

}

const PopupPortal: React.FC = () => {
	const { popupProps } = usePopup();
	const { setTabPopupOpen } = useTodoList();
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
			if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
				popupProps.onClose();
				setTabPopupOpen('');
			}
		}
		if (popupProps.isOpen) document.addEventListener('mousedown', handleOutsideClick);
		return () => { document.removeEventListener('mousedown', handleOutsideClick); }
	}, [popupProps.isOpen]);

	if (!popupProps.isOpen || !popupProps.children) return null;

	return (
		<div ref={popupRef} className={`nm-popup nm-frame nm-popup--${popupProps.name}`} style={{ left: popupProps.x, top: popupProps.y }}>
			{popupProps.children}
		</div>
	);
}