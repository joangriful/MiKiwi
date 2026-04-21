import { useEffect, useState, Suspense, lazy } from 'react';
import { Head } from '@inertiajs/react';
import ConfiguratorLayout from '@/Layouts/ConfiguratorLayout';
import SegmentedDoll2D from '@/Components/Configurator/PreviewArea/components/SegmentedDoll2D';
import BodyPartSelector from '@/Components/Configurator/CustomizationPanel/BodyPartSelector';
import { availableModels } from '@/Components/Configurator/MannequinModel/modelsMetadata';
import styles from './MannequinConfigurator.module.css';

const MannequinScene3D = lazy(() => import('@/Components/Configurator/Mannequin3DViewer/components/MannequinScene3D'));

const DEFAULT_BODY_PARAMS = {
    height: 0.5,
    bust: 0.5,
    hips: 0.5,
    waist: 0.5,
    legs: 0.5,
    shoulders: 0.5,
    head: 0.5,
};

const EMPTY_SELECTED_PARTS = {
    head: null,
    torso: null,
    armLeft: null,
    armRight: null,
    legLeft: null,
    legRight: null,
};

const DEFAULT_SELECTED_PARTS = {
    head: 'doll-2',
    bust: 'doll-2',
    arms: 'doll-2',
    torso: 'doll-2',
    pelvis: 'doll-2',
    legs: 'doll-2',
    hair: 'none',
    eyes: 'none',
};

const DEFAULT_SKIN_COLOR = '#ffd5b4';
const DEFAULT_HAIR_PARAMS = { style: 'bald', color: '#5d4037' };

function Loader({ label = 'Cargando modelo...' }) {
    return (
        <div className={styles.loader}>
            <div className={styles.loaderSpinner}></div>
            <p>{label}</p>
        </div>
    );
}

export default function MannequinConfigurator() {
    const [color, setColor] = useState(DEFAULT_SKIN_COLOR);
    const [customTexture] = useState(null);
    const [selectedModel, setSelectedModel] = useState(availableModels[0]);
    const [activeTab, setActiveTab] = useState('personalizar');
    const [bodyParams, setBodyParams] = useState(DEFAULT_BODY_PARAMS);
    const [hairParams, setHairParams] = useState(DEFAULT_HAIR_PARAMS);
    const [partLibrary, setPartLibrary] = useState(null);
    const [selectedParts, setSelectedParts] = useState(EMPTY_SELECTED_PARTS);

    useEffect(() => {
        fetch('/data/partLibrary.json')
            .then((response) => response.json())
            .then((data) => {
                setPartLibrary(data);
                setSelectedParts(EMPTY_SELECTED_PARTS);
            })
            .catch((error) => {
                console.error('Failed to load part library:', error);
            });
    }, []);

    const handlePartSelect = (partType, part) => {
        setSelectedParts((currentParts) => {
            const nextParts = { ...currentParts, [partType]: part };
            const pairingMap = {
                armLeft: 'armRight',
                armRight: 'armLeft',
                legLeft: 'legRight',
                legRight: 'legLeft',
            };

            const pairedType = pairingMap[partType];
            if (pairedType && partLibrary) {
                const currentDoll = partLibrary.dolls.find((doll) => doll.id === part.dollId);
                if (currentDoll?.parts?.[pairedType]) {
                    nextParts[pairedType] = {
                        ...currentDoll.parts[pairedType],
                        dollId: currentDoll.id,
                        dollName: currentDoll.name,
                        partType: pairedType,
                    };
                }
            }

            return nextParts;
        });
    };

    const resetValues = () => {
        setBodyParams(DEFAULT_BODY_PARAMS);
        setColor(DEFAULT_SKIN_COLOR);
        setHairParams(DEFAULT_HAIR_PARAMS);
        setSelectedParts(DEFAULT_SELECTED_PARTS);
    };

    return (
        <ConfiguratorLayout>
            <Head title="Configurador de Maniqui Avanzado" />

            <div className={styles.root}>
                <main className={styles.viewport}>
                    <Suspense fallback={<Loader />}>
                        {activeTab === 'chicas' ? (
                            <MannequinScene3D
                                modelPath={selectedModel.path}
                                texturePath={selectedModel.texturePath}
                                normalPath={selectedModel.normalPath}
                                modelId={selectedModel.id}
                                rotationY={selectedModel.rotationY || 0}
                                customTexture={customTexture}
                                color={color}
                                bodyParams={bodyParams}
                                hairParams={hairParams}
                            />
                        ) : (
                            <div className={styles.segmentedPreview}>
                                <div className={styles.segmentedPreviewInner}>
                                    <SegmentedDoll2D
                                        selectedParts={selectedParts}
                                        bodyProportions={{
                                            height: bodyParams.height,
                                            bust: bodyParams.bust,
                                            waist: bodyParams.waist,
                                            hips: bodyParams.hips,
                                        }}
                                        canvasWidth={800}
                                        canvasHeight={1000}
                                        showGuides={false}
                                    />
                                </div>
                            </div>
                        )}
                    </Suspense>

                    <section className={styles.viewportLabel} aria-label="Informacion del configurador">
                        <h1>Estudio de Diseno</h1>
                        <p>Configuracion Avanzada 3D</p>
                    </section>

                    <div className={styles.resetBar}>
                        <button type="button" onClick={resetValues} className={styles.resetButton}>
                            Resetear Valores
                        </button>
                    </div>
                </main>

                <aside className={styles.controlsPanel} aria-label="Controles del configurador">
                    <TabHeader activeTab={activeTab} onTabChange={setActiveTab} />

                    <div className={styles.controlsContent}>
                        {activeTab === 'chicas' ? (
                            <ModelSelection selectedModel={selectedModel} onSelectModel={setSelectedModel} />
                        ) : (
                            <PartSelection
                                partLibrary={partLibrary}
                                selectedParts={selectedParts}
                                onPartSelect={handlePartSelect}
                            />
                        )}
                    </div>
                </aside>
            </div>
        </ConfiguratorLayout>
    );
}

function TabHeader({ activeTab, onTabChange }) {
    return (
        <div className={styles.tabs} role="tablist" aria-label="Modo de configuracion">
            <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'chicas'}
                onClick={() => onTabChange('chicas')}
                className={`${styles.tabButton} ${activeTab === 'chicas' ? styles.tabButtonActivePink : ''}`}
            >
                Chicas
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'personalizar'}
                onClick={() => onTabChange('personalizar')}
                className={`${styles.tabButton} ${activeTab === 'personalizar' ? styles.tabButtonActiveBlue : ''}`}
            >
                Personalizar
            </button>
        </div>
    );
}

function ModelSelection({ selectedModel, onSelectModel }) {
    return (
        <section className={styles.panelSection}>
            <p className={styles.panelEyebrow}>Modelo 3D Base</p>
            <div className={styles.modelGrid}>
                {availableModels.map((model) => {
                    const isSelected = selectedModel.id === model.id;

                    return (
                        <button
                            key={model.id}
                            type="button"
                            onClick={() => onSelectModel(model)}
                            className={`${styles.modelCard} ${isSelected ? styles.modelCardSelected : ''}`}
                            aria-pressed={isSelected}
                        >
                            {model.thumbnail ? (
                                <img src={model.thumbnail} alt={model.name} className={styles.modelThumbnail} />
                            ) : (
                                <span className={styles.modelFallbackName}>{model.name}</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function PartSelection({ partLibrary, selectedParts, onPartSelect }) {
    if (!partLibrary) {
        return <Loader label="Cargando estudio..." />;
    }

    return (
        <section className={styles.panelSection}>
            <BodyPartSelector
                selectedParts={selectedParts}
                onPartSelect={onPartSelect}
                partLibrary={partLibrary}
            />
        </section>
    );
}
