<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use App\Models\HeroImage;
use Illuminate\Database\Eloquent\Collection;

interface HeroImageRepositoryInterface
{
    /**
     * Obtener todas las imágenes ordenadas
     */
    public function getAllOrdered(): Collection;

    /**
     * Obtener imágenes activas (para mostrar en frontend)
     */
    public function getActiveImages(): Collection;

    /**
     * Crear nueva imagen desde respuesta de Cloudinary
     */
    public function createFromCloudinary(array $cloudinaryData): HeroImage;

    /**
     * Eliminar imagen por ID
     */
    public function delete(string $id): bool;

    /**
     * Obtener imagen por ID
     */
    public function findById(string $id): ?HeroImage;

    /**
     * Actualizar orden de las imágenes
     */
    public function updateOrder(array $orderedIds): void;

    /**
     * Establecer imagen como activa/inactiva
     */
    public function setActive(string $id, bool $active): ?HeroImage;
}
