import { StateStorage, createJSONStorage } from 'zustand/middleware';

const firebaseUrl = 'https://zustand-storage-dacf7-default-rtdb.firebaseio.com/zustand';

const storageAPI: StateStorage = {
	getItem: async function ( name: string ): Promise<string | null> {

		try {
			const res = await fetch( `${ firebaseUrl }/${ name }.json` );
			const data = await res.json();

			console.log( data );

			return JSON.stringify( data );

		} catch ( error ) {

			throw error;

		}

	},

	setItem: async function ( name: string, value: string ): Promise<void> {

		const res = await fetch( `${ firebaseUrl }/${ name }.json`, {
			method: 'PUT',
			body: value
		} );

		const data = await res.json();

		console.log( data );

		return;

	},

	removeItem: function ( name: string ): void | Promise<void> {
		sessionStorage.removeItem( name );
	}
};

export const firebaseStorage = createJSONStorage( () => storageAPI );
