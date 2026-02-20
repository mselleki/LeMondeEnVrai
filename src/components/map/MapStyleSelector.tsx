import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import type { MapStyle } from '../../types';

const mapStyleOptions: Array<{ value: MapStyle; label: string; description: string }> = [
  {
    value: 'openstreetmap',
    label: 'OpenStreetMap',
    description: 'Style classique (noms en langue locale)',
  },
  {
    value: 'positron',
    label: 'Positron',
    description: 'Style clair, noms en français',
  },
  {
    value: 'voyager',
    label: 'Voyager',
    description: 'Style coloré, noms en français',
  },
];

export default function MapStyleSelector() {
  const mapStyle = useAppStore((state) => state.ui.mapStyle);
  const setMapStyle = useAppStore((state) => state.setMapStyle);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
        aria-label="Changer le style de carte"
        aria-expanded={isOpen}
      >
        <span>🗺️</span>
        <span className="hidden sm:inline">{mapStyleOptions.find((opt) => opt.value === mapStyle)?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
            {mapStyleOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setMapStyle(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                  mapStyle === option.value
                    ? 'bg-primary-50 text-primary-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
                {mapStyle === option.value && (
                  <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
