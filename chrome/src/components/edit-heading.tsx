// packages
import { useEffect, useRef, useState } from 'react'
// hooks
import { useTodoList } from '../contexts/todo.context';

interface EditHeadingProps {
	onChange: (value: string) => void;
	onBlur: () => void;
}

export const EditHeading = ({ onChange, onBlur }: EditHeadingProps) => {
	const { activeTab, activeList, todoList } = useTodoList();
	const textRef = useRef<HTMLTextAreaElement>(null);
	const [value, setValue] = useState<string>(todoList?.[activeTab]?.lists?.[activeList]?.heading);

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

	return (
		<textarea ref={textRef} className='nm-note__heading' value={value} onChange={(e) => handleChange(e.target.value)} onBlur={onBlur} placeholder='Type heading...' />
	);
}