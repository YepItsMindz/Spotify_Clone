import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

export interface Playlist {
  _id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  songs: string[];
  createdAt: string;
  updatedAt: string;
}

interface PlaylistsStore {
  playlists: Playlist[];
  isLoading: boolean;
  error: string | null;
  fetchPlaylists: () => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<Playlist | null>;
  createPlaylist: (data: { title: string; description?: string; imageFile?: File }) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
}

export const usePlaylistsStore = create<PlaylistsStore>((set, get) => ({
  playlists: [],
  isLoading: false,
  error: null,

  fetchPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get('/playlists/user'); // updated endpoint for user playlists
      set({ playlists: Array.isArray(res.data) ? res.data : [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to fetch playlists' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaylistById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/playlists/${id}`);
      return res.data;
    } catch (error: any) {
      set({ error: error?.response?.data?.message || 'Failed to fetch playlist' });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createPlaylist: async ({ title, description, imageFile }) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('title', title);
      if (description) formData.append('description', description);
      if (imageFile) formData.append('imageFile', imageFile);
      const res = await axiosInstance.post('/playlists', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set((state) => ({ playlists: [res.data, ...state.playlists] }));
      toast.success('Playlist created successfully');
    } catch (error: any) {
      toast.error('Failed to create playlist: ' + (error?.response?.data?.message || error.message));
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlaylist: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/playlists/${id}`);
      set((state) => ({ playlists: state.playlists.filter((p) => p._id !== id) }));
      toast.success('Playlist deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete playlist');
    } finally {
      set({ isLoading: false });
    }
  },

  addSongToPlaylist: async (playlistId, songId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
      toast.success('Song added to playlist');
      // Optionally, refetch playlists or playlist detail here
    } catch (error: any) {
      toast.error('Failed to add song to playlist');
    } finally {
      set({ isLoading: false });
    }
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
      toast.success('Song removed from playlist');
      // Optionally, refetch playlists or playlist detail here
    } catch (error: any) {
      toast.error('Failed to remove song from playlist');
    } finally {
      set({ isLoading: false });
    }
  },
}));
