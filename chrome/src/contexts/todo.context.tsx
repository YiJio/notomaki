// packages
import { createContext, useContext, useState, useEffect } from 'react';

interface TodoItem {
	text: string;
	completed: boolean;
	cursorPosition: number;
}

interface TodoList {
	[tabId: string]: {
		name: string;
		color: string;
		lists: {
			[listId: string]: {
				name: string;
				items: TodoItem[];
			};
		};
	};
}

interface TodoListContextType {
	todoList: TodoList;
	setTodoList: (todoList: TodoList) => void;
	handleUpdate: (action: string, payload: any) => void;
	isLoading: boolean;
	error: string | null | undefined;
}

const TodoListContext = createContext<TodoListContextType | undefined>(undefined);

export function useTodoList(): TodoListContextType {
	const context = useContext(TodoListContext);
	if (context === undefined) {
		throw new Error('useTodoList must be used within a TodoListProvider');
	}
	return context;
}

export const TodoListProvider = ({ children }: { children: React.ReactNode }) => {
	const [todoList, setTodoList] = useState<TodoList>({});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null | undefined>(null);

	useEffect(() => {
		setIsLoading(true);
		const getTodoList = async () => {
			try {
				/*const response: any = await new Promise((resolve) => {
					chrome.runtime.sendMessage({ action: 'getTodoList' }, (resolve));
				});
				console.log(response)
				setTodoList(response.todoList);*/
				chrome.runtime.sendMessage({ action: "getTodoList" }, (response) => {
					if (chrome.runtime.lastError) {
						console.error("Error sending message:", chrome.runtime.lastError);
					} else {
						// Handle the response
						console.log(response.todoList)
						setTodoList(response.todoList);
					}
				});
			} catch (error) {
				setError('Failed to get todo list');
			} finally {
				setIsLoading(false);
			}
		}
		getTodoList();
	}, []);

	const handleSetTodoList = async (newTodoList: TodoList) => {
		setIsLoading(true);
		try {
			const response: any = await new Promise((resolve) => {
				chrome.runtime.sendMessage({ action: 'setTodoList', payload: { todoList: newTodoList } }, resolve);
			});
			if (response.error) { setError(response.error); }
			else { setTodoList(newTodoList); }
		} catch (error) {
			setError('Failed to set todo list');
		} finally {
			setIsLoading(false);
		}
	}

	const handleUpdate = async (action: string, payload: any) => {
		setIsLoading(true);
		try {
			const response: any = await new Promise((resolve) => {
				chrome.runtime.sendMessage({ action, payload }, resolve);
			});
			if (response.error) { setError(response.error); }
			else { console.log(response); }
		} catch (error) {
			setError('Failed to update');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<TodoListContext.Provider value={{ todoList, setTodoList: handleSetTodoList, handleUpdate, isLoading, error }}>
			{children}
		</TodoListContext.Provider>
	);
};

export default TodoListContext;