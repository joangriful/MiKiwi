import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ImageEditorModal from '@/Components/Profile/ImageEditorModal/ImageEditorModal';
import useProductFavorite from '@/Hooks/useProductFavorite';
import { normalizeApiError } from '@/Utils/httpError';
import styles from './ProfileTab.module.css';

function RecommendedProductFavoriteButton({ product }) {
    const { isFavorite, isTogglingFavorite, toggleFavorite } = useProductFavorite(product);

    return (
        <button
            type="button"
            disabled={isTogglingFavorite}
            onClick={async (event) => {
                event.preventDefault();
                await toggleFavorite();
            }}
            className={styles.favoriteButton}
            aria-label={isFavorite ? `Quitar ${product.name} de favoritos` : `Añadir ${product.name} a favoritos`}
            aria-pressed={isFavorite}
        >
            <div
                className={`${styles.favoriteIcon} ${isFavorite ? styles.favoriteIconActive : ''}`}
                style={{
                    maskImage: `url('/assets/icons/${isFavorite ? 'MdiCardsHeart.svg' : 'MdiCardsHeartOutline.svg'}')`,
                    WebkitMaskImage: `url('/assets/icons/${isFavorite ? 'MdiCardsHeart.svg' : 'MdiCardsHeartOutline.svg'}')`,
                }}
            />
        </button>
    );
}

export default function ProfileTab({ setActiveTab, recommendedProducts = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user || {
        name: 'Usuario MiKiwi',
        email: 'usuario@mikiwi.com',
        profile_photo_url: null,
        banner_url: null,
    };

    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [currentProfileImage, setCurrentProfileImage] = useState(user.profile_photo_url);
    const [currentBannerImage, setCurrentBannerImage] = useState(user.banner_url);
    const [editorState, setEditorState] = useState({
        isOpen: false,
        type: 'profile',
        imageUrl: null,
    });

    const handleEditProfileImage = () => {
        setEditorState({
            isOpen: true,
            type: 'profile',
            imageUrl: currentProfileImage,
        });
    };

    const handleEditBanner = () => {
        setEditorState({
            isOpen: true,
            type: 'banner',
            imageUrl: currentBannerImage,
        });
    };

    const handleEditorSave = async (croppedBlob) => {
        if (editorState.type === 'profile') {
            await uploadProfileImage(croppedBlob);
            return;
        }

        await uploadBanner(croppedBlob);
    };

    const handleEditorClose = () => {
        setEditorState((currentState) => ({
            ...currentState,
            isOpen: false,
        }));
    };

    const uploadProfileImage = async (blob) => {
        setUploadingProfile(true);
        const formData = new FormData();
        formData.append('image', blob, 'profile.jpg');

        try {
            const response = await axios.post(route('profile.image.update'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setCurrentProfileImage(response.data.profile_photo_url);
                toast.success('✓ Foto de perfil actualizada correctamente');
                router.reload({ only: ['auth'] });
            } else {
                toast.error(normalizeApiError({ response: { data: response.data } }).message);
            }
        } catch (error) {
            toast.error(normalizeApiError(error, {
                title: 'No pudimos actualizar la foto',
                message: 'No pudimos actualizar tu foto de perfil. Inténtalo de nuevo en unos minutos.',
                code: 'profile_image_upload_failed',
            }).message);
        } finally {
            setUploadingProfile(false);
        }
    };

    const uploadBanner = async (blob) => {
        setUploadingBanner(true);
        const formData = new FormData();
        formData.append('image', blob, 'banner.jpg');

        try {
            const response = await axios.post(route('profile.banner.update'), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                setCurrentBannerImage(response.data.banner_url);
                toast.success('✓ Banner actualizado correctamente');
                router.reload({ only: ['auth'] });
            } else {
                toast.error(normalizeApiError({ response: { data: response.data } }).message);
            }
        } catch (error) {
            toast.error(normalizeApiError(error, {
                title: 'No pudimos actualizar el banner',
                message: 'No pudimos actualizar tu banner. Inténtalo de nuevo en unos minutos.',
                code: 'profile_banner_upload_failed',
            }).message);
        } finally {
            setUploadingBanner(false);
        }
    };

    return (
        <div className={`${styles.root} ${styles.stack}`}>
            <ImageEditorModal
                isOpen={editorState.isOpen}
                onClose={handleEditorClose}
                aspectRatio={editorState.type === 'profile' ? 1 : 16 / 4}
                onSave={handleEditorSave}
                onError={(message) => toast.error(message)}
                type={editorState.type}
                existingImageUrl={editorState.imageUrl}
            />

            <div className={styles.profileCard}>
                <div className={styles.bannerArea}>
                    <div
                        className={styles.bannerBackground}
                        style={currentBannerImage ? {
                            backgroundImage: `url(${currentBannerImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        } : {}}
                    >
                        {!currentBannerImage && <div className={styles.bannerPattern} />}
                    </div>

                    <div className={styles.bannerOverlay}>
                        <button
                            onClick={handleEditBanner}
                            disabled={uploadingBanner}
                            className={styles.bannerButton}
                        >
                            {uploadingBanner ? (
                                <>
                                    <span className={`${styles.materialIcon} ${styles.spin}`}>refresh</span>
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <span className={styles.materialIcon}>edit</span>
                                    {currentBannerImage ? 'Editar Banner' : 'Añadir Banner'}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className={styles.profileBody}>
                    <div className={styles.profileHeader}>
                        <div className={styles.profileIdentity}>
                            <div className={styles.avatarWrap}>
                                <div className={styles.avatarFrame}>
                                    <img
                                        src={currentProfileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=256`}
                                        alt={user.name}
                                        className={styles.avatarImage}
                                    />
                                </div>

                                {!uploadingProfile && (
                                    <button
                                        onClick={handleEditProfileImage}
                                        disabled={uploadingProfile}
                                        className={styles.avatarEdit}
                                    >
                                        <span className={styles.materialIconLarge}>edit</span>
                                    </button>
                                )}

                                {uploadingProfile && (
                                    <div className={styles.avatarLoading}>
                                        <span className={`${styles.materialIconLarge} ${styles.spin}`}>refresh</span>
                                    </div>
                                )}

                                {!uploadingProfile && <div className={styles.statusDot} />}
                            </div>

                            <div className={styles.identityText}>
                                <h2 className={styles.userName}>{user.name}</h2>
                                <p className={styles.userEmail}>{user.email}</p>
                            </div>
                        </div>

                        <div className={styles.profileActions}>
                            <button onClick={() => setActiveTab('edit-account')} className={styles.secondaryButton}>
                                Editar perfil
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.recommendationsCard}>
                <div className={styles.recommendationsHeader}>
                    <h3 className={styles.recommendationsTitle}>
                        <span className={`${styles.materialIcon} ${styles.titleIcon}`}>magic_button</span>
                        Recomendados para ti
                    </h3>

                    {recommendedProducts && recommendedProducts.length > 0 && (
                        <Link href="/configurador/quiz" className={styles.secondaryLink}>
                            <span className={styles.materialIcon}>refresh</span>
                            Repetir Quiz
                        </Link>
                    )}
                </div>

                {recommendedProducts && recommendedProducts.length > 0 ? (
                    <div className={styles.productsGrid}>
                        {recommendedProducts.map((product) => (
                            <div key={product.id} className={styles.productCard}>
                                {product.category && (
                                    <div className={styles.categoryBadge}>
                                        <span className={styles.categoryText}>{product.category.name}</span>
                                    </div>
                                )}

                                <div className={styles.productImageBox}>
                                    {product.image_url ? (
                                        <>
                                            <img src={product.image_url} alt={product.name} className={styles.productImage} />
                                            {product.hover_image_url && (
                                                <img
                                                    src={product.hover_image_url}
                                                    alt={`${product.name} hover`}
                                                    className={styles.productHoverImage}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className={styles.productPlaceholder} />
                                    )}

                                    <RecommendedProductFavoriteButton product={product} />
                                </div>

                                <div className={styles.productInfo}>
                                    <div className={styles.productHeading}>
                                        <h4 className={styles.productName}>{product.name}</h4>
                                        <span className={styles.productPrice}>
                                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.base_price)}
                                        </span>
                                    </div>
                                    <div className={styles.productDivider} />
                                    <p className={styles.productDescription}>
                                        {product.description || 'Ingeniería sensorial premium'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyQuizState}>
                        <span className={`${styles.materialIconLarge} ${styles.emptyQuizIcon}`}>quiz</span>
                        <h4 className={styles.emptyQuizTitle}>Descubre tu estilo ideal</h4>
                        <p className={styles.emptyQuizText}>
                            Completa nuestro quiz inicial para que podamos recomendarte los productos que mejor se adapten a tus gustos y preferencias.
                        </p>
                        <Link href="/configurador/quiz" className={styles.primaryLink}>
                            Realizar el Quiz
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
