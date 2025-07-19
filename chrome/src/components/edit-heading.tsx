// packages
import { useEffect, useRef, useState } from 'react';
// hooks
import { useTodoList } from '../contexts/todo.context';

interface EditHeadingProps {
	defaultValue: string;
	onChange: (value: string) => void;
	onBlur: () => void;
}

export const EditHeading = ({ defaultValue, onChange, onBlur }: EditHeadingProps) => {
	const { activeTab, activeList, todoList } = useTodoList();
	const textRef = useRef<HTMLTextAreaElement>(null);
	const [value, setValue] = useState<string>(defaultValue);
	console.log(todoList?.[activeTab]?.lists?.[activeList]?.heading)

	const handleChange = (value: string) => {
		setValue(value);
		onChange && onChange(value);
	}

	useEffect(() => {
		if (textRef.current) {
			textRef.current.style.height = '32px';
			const scrollHeight = textRef.current.scrollHeight;
			textRef.current.style.height = `${scrollHeight}px`;
		}
	}, [textRef.current, value]);

	useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);

	return (
		<textarea ref={textRef} className='nm-note__heading' value={value} onChange={(e) => handleChange(e.target.value)} onBlur={onBlur} placeholder='Type heading...' />
	);
}