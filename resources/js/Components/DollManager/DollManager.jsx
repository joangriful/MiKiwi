import React, { useState, forwardRef, useImperativeHandle } from 'react';
import DollDefaultConfigurator from './DollDefaultConfigurator';
import DollZoomConfigurator from './DollZoomConfigurator';
import DollSectionOrderConfigurator from './DollSectionOrderConfigurator';
import axios from 'axios';

const DollManager = forwardRef(({ views, defaultSettings }, ref) => {
    const [activeSection, setActiveSection] = useState('default_images');

    // Master State for all defaults
    // Expected structure: { selections: { front:..., back:... }, zoom: { x, y, w, h }, sectionOrder: [] }
    const [fullSettings, setFullSettings] = useState(() => {
        // Migration logic for existing data (if it's old flat format)
        // If defaultSettings has 'selections' key, it's new format.
        // If not, assume it's the old format (selections directly)
        let initialSettings = {};

        if (defaultSettings && !defaultSettings.selections && (defaultSettings.front || defaultSettings.back || Object.keys(defaultSettings).length > 0)) {
            initialSettings = {
                selections: defaultSettings,
                zoom: { x: 0, y: 0, w: 1, h: 1 }, // Default full view
                sectionOrder: []
            };
        } else {
            // Default clean state
            initialSettings = {
                selections: defaultSettings?.selections || { front: {}, back: {} },
                zoom: defaultSettings?.zoom || { x: 0, y: 0, w: 1, h: 1 },
                sectionOrder: defaultSettings?.sectionOrder || []
            };
        }
        return initialSettings;
    });

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    const saveSettings = async () => {
        setSaving(true);
        setMessage(null);

        try {
            await axios.post(route('doll.settings.save'), { settings: fullSettings });
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings.' });
            console.error(error);
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    useImperativeHandle(ref, () => ({
        save: saveSettings
    }));

    // State updaters
    const updateSelections = (newSelections) => {
        setFullSettings(prev => ({ ...prev, selections: newSelections }));
    };

    const updateZoom = (newZoom) => {
        setFullSettings(prev => ({ ...prev, zoom: newZoom }));
    };

    const updateSectionOrder = (newOrder) => {
        setFullSettings(prev => ({ ...prev, sectionOrder: newOrder }));
    };

    const sections = [
        { id: 'default_images', label: 'Default Images' },
        { id: 'default_zoom', label: 'Default Zoom' },
        { id: 'section_order', label: 'Section Order' },
    ];

    return (
        <div className="flex flex-1 overflow-hidden h-full relative">
            {/* Global Message Toast */}
            {message && (
                <div className={`absolute top-4 right-4 px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
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
            <main className="flex-1 bg-transparent overflow-hidden relative">
                {activeSection === 'default_images' && (
                    <DollDefaultConfigurator
                        views={views}
                        currentSelections={fullSettings.selections}
                        onSelectionChange={updateSelections}
                        saving={saving}
                    />
                )}
                {activeSection === 'default_zoom' && (
                    <DollZoomConfigurator
                        views={views}
                        currentSelections={fullSettings.selections}
                        currentZoom={fullSettings.zoom}
                        onZoomChange={updateZoom}
                        saving={saving}
                    />
                )}
                {activeSection === 'section_order' && (
                    <DollSectionOrderConfigurator
                        views={views}
                        currentOrder={fullSettings.sectionOrder}
                        onSave={(order) => {
                            updateSectionOrder(order);
                            // For this one, we might want to trigger save immediately or just update state?
                            // Plan says global save, so just update state.
                        }}
                        saving={saving}
                        message={message} // Keep passing message to this one if it handles its own UI or remove
                    />
                )}
            </main>
        </div>
    );
});

export default DollManager;
