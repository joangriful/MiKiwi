import React, { useState } from 'react';
import DollDefaultConfigurator from './DollDefaultConfigurator';
import DollZoomConfigurator from './DollZoomConfigurator';
import axios from 'axios';

export default function DollManager({ views, defaultSettings }) {
    const [activeSection, setActiveSection] = useState('default_images');

    // Master State for all defaults
    // Expected structure: { selections: { front:..., back:... }, zoom: { x, y, w, h } }
    const [fullSettings, setFullSettings] = useState(() => {
        // Migration logic for existing data (if it's old flat format)
        // If defaultSettings has 'selections' key, it's new format.
        // If not, assume it's the old format (selections directly)
        if (defaultSettings && !defaultSettings.selections && (defaultSettings.front || defaultSettings.back || Object.keys(defaultSettings).length > 0)) {
            return {
                selections: defaultSettings,
                zoom: { x: 0, y: 0, w: 1, h: 1 } // Default full view
            };
        }

        // Default clean state
        return {
            selections: defaultSettings?.selections || { front: {}, back: {} },
            zoom: defaultSettings?.zoom || { x: 0, y: 0, w: 1, h: 1 }
        };
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSave = async (partialUpdate) => {
        setSaving(true);
        setMessage(null);

        // Merge updates
        const newSettings = {
            ...fullSettings,
            ...partialUpdate
        };

        try {
            await axios.post(route('doll.settings.save'), { settings: newSettings });
            setFullSettings(newSettings); // Update local state
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings.' });
            console.error(error);
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const sections = [
        { id: 'default_images', label: 'Default Images' },
        { id: 'default_zoom', label: 'Default Zoom' },
    ];

    return (
        <div className="flex flex-1 overflow-hidden h-full">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Doll Configuration
                    </h2>
                </div>
                <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 bg-white overflow-hidden relative">
                {activeSection === 'default_images' && (
                    <DollDefaultConfigurator
                        views={views}
                        currentSelections={fullSettings.selections}
                        onSave={(selections) => handleSave({ selections })}
                        saving={saving}
                        message={message}
                    />
                )}
                {activeSection === 'default_zoom' && (
                    <DollZoomConfigurator
                        views={views}
                        currentSelections={fullSettings.selections}
                        currentZoom={fullSettings.zoom}
                        onSave={(zoom) => handleSave({ zoom })}
                        saving={saving}
                        message={message}
                    />
                )}
            </main>
        </div>
    );
}
