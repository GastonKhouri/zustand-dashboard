import { StateCreator, create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { immer } from 'zustand/middleware/immer';
// import { produce } from 'immer';

import { Task, TaskStatus } from '../../interfaces';

interface TaskState {
	tasks: Record<string, Task>; // { [key: string]: Task }
	draggingTaskId?: string;

	getTasksByStatus: ( status: TaskStatus ) => Task[];
	addTask: ( title: string, status: TaskStatus ) => void;
	totalTasks: () => number;

	setDraggingTaskId: ( id: string ) => void;
	removeDraggingTaskId: () => void;
	changeTaskStatus: ( id: string, status: TaskStatus ) => void;
	onTaskDrop: ( status: TaskStatus ) => void;
}

const storeApi: StateCreator<TaskState, [ [ "zustand/immer", never ] ]> = ( set, get ) => ( {

	draggingTaskId: undefined,

	tasks: {
		'ABC-1': { id: 'ABC-1', title: 'Task 1', status: 'open' },
		'ABC-2': { id: 'ABC-2', title: 'Task 2', status: 'in-progress' },
		'ABC-3': { id: 'ABC-3', title: 'Task 3', status: 'open' },
		'ABC-4': { id: 'ABC-4', title: 'Task 4', status: 'open' },
	},

	// tasks length
	totalTasks: () => {
		return Object.keys( get().tasks ).length;
	},

	getTasksByStatus: ( status: TaskStatus ) => {

		const tasks = get().tasks;
		const filteredTasks = Object.values( tasks ).filter( task => task.status === status );

		return filteredTasks;

	},

	addTask: ( title: string, status: TaskStatus ) => {

		const newTask: Task = { id: uuidv4(), title, status };

		//? zustand/immer
		set( ( state ) => {
			state.tasks[ newTask.id ] = newTask;
		} );

		//? npm i immer 
		// set( produce( ( state: TaskState ) => {
		// 	state.tasks[ newTask.id ] = newTask;
		// } ) );

		//? native
		// set( ( state ) => ( {
		// 	tasks: {
		// 		...state.tasks,
		// 		[ newTask.id ]: newTask,
		// 	},
		// } ) );

	},

	setDraggingTaskId: ( id: string ) => {
		set( { draggingTaskId: id } );
	},

	removeDraggingTaskId: () => {
		set( { draggingTaskId: undefined } );
	},

	changeTaskStatus: ( id: string, status: TaskStatus ) => {

		// const task = get().tasks[ id ];
		// task.status = status;

		set( ( state ) => {
			state.tasks[ id ] = {
				...state.tasks[ id ],
				status,
			};
		} );

		// if ( task ) {
		// 	set( ( state ) => ( {
		// 		tasks: {
		// 			...state.tasks,
		// 			[ id ]: task,
		// 		},
		// 	} ) );
		// }

	},

	onTaskDrop: ( status: TaskStatus ) => {

		const draggingTaskId = get().draggingTaskId;
		if ( !draggingTaskId ) return;

		get().changeTaskStatus( draggingTaskId, status );
		get().removeDraggingTaskId();

	},



} );

export const useTaskStore = create<TaskState>()(
	devtools(
		persist(
			immer(
				storeApi
			),
			{
				name: 'task-store'
			}
		)
	)
);

