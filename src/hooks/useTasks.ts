import { useState } from 'react';
import Swal from 'sweetalert2';

import { useTaskStore } from '../stores';
import { TaskStatus } from '../interfaces';

export const useTasks = ( status: TaskStatus ) => {

	const isDragging = useTaskStore( state => !!state.draggingTaskId );
	const onTaskDrop = useTaskStore( state => state.onTaskDrop );
	const addTask = useTaskStore( state => state.addTask );

	const [ onDragOver, setOnDragOver ] = useState( false );

	const handleAddTask = async () => {

		const { isConfirmed, value } = await Swal.fire( {
			title: 'New Task',
			input: 'text',
			inputLabel: 'Task Name',
			inputPlaceholder: 'Enter the task name',
			showCancelButton: true,
			inputValidator: ( value ) => {
				if ( !value ) {
					return 'You need to write something!';
				}
			}
		} );

		if ( !isConfirmed ) return;

		addTask( value, status );
	};

	const handleDragOver = ( e: React.DragEvent<HTMLDivElement> ) => {
		e.preventDefault();
		setOnDragOver( true );
	};

	const handleDragLeave = ( e: React.DragEvent<HTMLDivElement> ) => {
		e.preventDefault();
		setOnDragOver( false );
	};

	const handleDrop = ( e: React.DragEvent<HTMLDivElement> ) => {
		e.preventDefault();
		setOnDragOver( false );
		onTaskDrop( status );
	};

	return {
		handleDragOver,
		handleDragLeave,
		handleDrop,
		isDragging,
		onDragOver,
		handleAddTask,
	};

};
