import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Country, City, Discovery, AppState, Toast } from '../types';

interface AppStore extends AppState {
  // Actions
  setSelectedCountry: (country: Country | null) => void;
  setSelectedCity: (city: City | null) => void;
  addDiscovery: (discovery: Omit<Discovery, 'id' | 'savedAt'>) => void;
  removeDiscovery: (id: string) => void;
  toggleDrawer: () => void;
  setPanelOpen: (open: boolean) => void;
  setMapZoom: (zoom: number) => void;
  setMapStyle: (style: 'openstreetmap' | 'positron' | 'voyager') => void;
  updateCuriosityScore: (countryId: string, increment: number) => void;
  clearSelection: () => void;
  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

const STORAGE_KEY = 'lemondeenvrai-storage';

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      selectedCountryId: null,
      selectedCountry: null,
      selectedCityId: null,
      selectedCity: null,
      discoveries: [],
      toasts: [],
      ui: {
        drawerOpen: false,
        panelOpen: false,
        mapZoom: 2,
        mapStyle: 'openstreetmap' as const,
      },
      curiosityScores: {},

      setSelectedCountry: (country) => {
        set({
          selectedCountryId: country?.id || null,
          selectedCountry: country,
          selectedCityId: null,
          selectedCity: null,
          ui: {
            ...get().ui,
            panelOpen: country !== null,
          },
        });
        if (country) {
          get().updateCuriosityScore(country.id, 5);
        }
      },

      setSelectedCity: (city) => {
        set({
          selectedCityId: city?.id || null,
          selectedCity: city,
          ui: {
            ...get().ui,
            panelOpen: city !== null,
          },
        });
        if (city) {
          const country = get().selectedCountry;
          if (country) {
            get().updateCuriosityScore(country.id, 2);
          }
        }
      },

      addDiscovery: (discovery) => {
        const newDiscovery: Discovery = {
          ...discovery,
          id: `${discovery.type}-${Date.now()}`,
          savedAt: Date.now(),
        };
        set({
          discoveries: [...get().discoveries, newDiscovery],
        });
      },

      removeDiscovery: (id) => {
        set({
          discoveries: get().discoveries.filter((d) => d.id !== id),
        });
      },

      toggleDrawer: () => {
        const current = get().ui.drawerOpen ?? false;
        set({
          ui: {
            ...get().ui,
            drawerOpen: !current,
          },
        });
      },

      setPanelOpen: (open) => {
        set({
          ui: {
            ...get().ui,
            panelOpen: open,
          },
        });
      },

      setMapZoom: (zoom) => {
        set({
          ui: {
            ...get().ui,
            mapZoom: zoom,
          },
        });
      },

      setMapStyle: (style) => {
        set({
          ui: {
            ...get().ui,
            mapStyle: style,
          },
        });
      },

      updateCuriosityScore: (countryId, increment) => {
        const current = get().curiosityScores[countryId] || 0;
        const newScore = Math.min(100, Math.max(0, current + increment));
        set({
          curiosityScores: {
            ...get().curiosityScores,
            [countryId]: newScore,
          },
        });
      },

      clearSelection: () => {
        set({
          selectedCountryId: null,
          selectedCountry: null,
          selectedCityId: null,
          selectedCity: null,
          ui: {
            ...get().ui,
            panelOpen: false,
          },
        });
      },

      showToast: (message, type = 'info') => {
        const id = `toast-${Date.now()}`;
        set({ toasts: [...get().toasts, { id, message, type }] });
        setTimeout(() => {
          get().dismissToast(id);
        }, 3500);
      },

      dismissToast: (id) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        discoveries: state.discoveries,
        curiosityScores: state.curiosityScores,
        ui: {
          mapStyle: state.ui.mapStyle,
        },
      }),
    }
  )
);
