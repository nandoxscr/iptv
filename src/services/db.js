// services/db.js
import { openDB } from 'idb';

const initDB = async () => {
  const db = await openDB('playlistDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('PLAYLIST_STORE')) {
        db.createObjectStore('PLAYLIST_STORE', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
};

export const getPlaylistsFromDB = async () => {
  const db = await initDB();
  const tx = db.transaction('PLAYLIST_STORE', 'readonly');
  const store = tx.objectStore('PLAYLIST_STORE');
  const playlists = await store.getAll();
  await tx.done;
  return playlists;
};

export const addPlaylistToDB = async (playlist) => {
  const db = await initDB();
  const tx = db.transaction('PLAYLIST_STORE', 'readwrite');
  const store = tx.objectStore('PLAYLIST_STORE');
  const id = await store.put(playlist);
  await tx.done;
  return id;
};

export const deletePlaylistFromDB = async (id) => {
  const db = await initDB();
  const tx = db.transaction('PLAYLIST_STORE', 'readwrite');
  const store = tx.objectStore('PLAYLIST_STORE');
  await store.delete(id);
  await tx.done;
};

export const updatePlaylistInDB = async (id, updatedPlaylist) => {
  const db = await initDB();
  const tx = db.transaction('PLAYLIST_STORE', 'readwrite');
  const store = tx.objectStore('PLAYLIST_STORE');
  await store.put({ ...updatedPlaylist, id });
  await tx.done;
};