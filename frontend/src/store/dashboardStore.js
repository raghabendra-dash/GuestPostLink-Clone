import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';

const defaultLayout = [
  { i: 'traffic', x: 0, y: 0, w: 6, h: 4 },
  { i: 'revenue', x: 6, y: 0, w: 6, h: 4 },
  { i: 'notifications', x: 0, y: 4, w: 12, h: 4 }
];

export const useDashboardStore = create(
  persist(
    (set) => ({
      analytics: [],
      notifications: [],
      widgetLayout: defaultLayout,
      loading: false,
      error: null,

      setAnalytics: (data) => set({ analytics: data }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 50)
        })),

      updateWidgetLayout: (layout) => set({ widgetLayout: layout }),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        })),

      clearNotifications: () => set({ notifications: [] }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      fetchAnalytics: async () => {
        try {
          set({ loading: true, error: null, analytics: [] }); 
          const response = await api.get('/analytics');
          set({ analytics: response.data });
        } catch (error) {
          console.error('Analytics Fetch Error:', error?.response?.data || error.message);
          set({ error: 'Failed to fetch analytics data' });
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({
        widgetLayout: state.widgetLayout,
        notifications: state.notifications.filter((n) => !n.read) 
      })
    }
  )
);
