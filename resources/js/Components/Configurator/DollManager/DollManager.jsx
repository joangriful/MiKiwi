import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import DollDefaultConfigurator from '../DollDefaultConfigurator/DollDefaultConfigurator';
import DollPartConfigurator from '../DollPartConfigurator/DollPartConfigurator';
import DollZoomConfigurator from '../DollZoomConfigurator/DollZoomConfigurator';
import DollSectionOrderConfigurator from '../DollSectionOrderConfigurator/DollSectionOrderConfigurator';
import axios from 'axios';
import styles from './DollManager.module.css';

const DollManager = forwardRef(({ views, defaultSettings, partPositions: initialPartPositions }, ref) => {
    const [activeSection, setActiveSection] = useState('default_images');

    // Master State for all defaults
    const [fullSettings, setFullSettings] = useState(() => {
        let initialSettings = {};
        if (defaultSettings && !defaultSettings.selections && (defaultSettings.front || defaultSettings.back || Object.keys(defaultSettings).length > 0)) {
            initialSettings = {
                selections: defaultSettings,
                zoom: { x: 0, y: 0, w: 1, h: 1 },
                sectionOrder: []
            };
        } else {
            initialSettings = {
                selections: defaultSettings?.selections || { front: {}, back: {} },
                zoom: defaultSettings?.zoom || { x: 0, y: 0, w: 1, h: 1 },
                sectionOrder: defaultSettings?.sectionOrder || []
            };
        }
        return initialSettings;
    });

    // Lifted Part Positions State (Single Source of Truth)
    const [partPositions, setPartPositions] = useState(initialPartPositions || {});

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Optimistic Position Update Handler
    const handlePositionUpdate = (data) => {
        const key = `${data.view}|${data.category}|${data.part_id}`;

        // Optimistic Update
        const oldPositions = { ...partPositions };
        setPartPositions(prev => ({
            ...prev,
            [key]: { x: data.x, y: data.y, scale: data.scale }
        }));

        axios.post(route('doll.settings.savePosition'), data)
            .then(() => {
                setMessage({ type: 'success', text: 'Posición guardada correctamente' });
            })
            .catch(err => {
                console.error(err);
                // Revert on failure
                setPartPositions(oldPositions);
                const msg = err.response?.data?.message || err.message || 'Error desconocido';
                setMessage({ type: 'error', text: `Error al guardar: ${msg}` });
            });
    };

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
        }
    };

    // Auto-dismiss message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

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
        { id: 'default_images', label: 'Default Doll' },
        { id: 'preview_parts', label: 'Preview Doll Parts' },
        { id: 'default_zoom', label: 'Default Zoom' },
        { id: 'section_order', label: 'Section Order' },
    ];

    return (
        <div className={styles.root}>
            {message && (
                <div className={[
                    styles.toast,
                    message.type === 'success'
                        ? styles.toastSuccess
                        : styles.toastError,
                ].join(' ')}>
                    {message.text}
                </div>
            )}

            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>
                        Doll Configuration
                    </h2>
                </div>
                <nav className={styles.nav}>
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={[
                                styles.navButton,
                                activeSection === section.id
                                    ? styles.navButtonActive
                                    : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className={styles.main}>
                {activeSection === 'default_images' && (
                    <DollDefaultConfigurator
                        views={views}
                        currentSelections={fullSettings.selections}
                        onSelectionChange={updateSelections}
                        saving={saving}
                        partPositions={partPositions} // Passed down lifted state
                    />
                )}
                {activeSection === 'preview_parts' && (
                    <DollPartConfigurator
                        views={views}
                        saving={saving}
                        setMessage={setMessage}
                        partPositions={partPositions}       // Pass lifted state
                        onSavePosition={handlePositionUpdate} // Pass update handler
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
                        }}
                        saving={saving}
                        message={message}
                    />
                )}
            </main>
        </div>
    );
});

export default DollManager;
