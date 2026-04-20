# Herramienta de Segmentación de Muñecas

Esta herramienta segmenta automáticamente imágenes de muñecas en partes individuales del cuerpo para el configurador MiKiwi.

## Requisitos

Primero, instala la dependencia `sharp`:

```bash
npm install sharp
```

## Uso Básico

```bash
node tools/segmentDoll.js --input <archivo_entrada> --output <directorio_salida> --name "Nombre de la Muñeca"
```

### Ejemplo

```bash
node tools/segmentDoll.js \
  --input public/assets/source/muñeca_clasica.png \
  --output public/assets/dolls/doll_01 \
  --name "Muñeca Clásica" \
  --variant "classic"
```

## Opciones

| Opción | Alias | Descripción | Requerido |
|--------|-------|-------------|-----------|
| `--input` | `-i` | Archivo de imagen de entrada (PNG completo de la muñeca) | ✅ |
| `--output` | `-o` | Directorio de salida para las partes segmentadas | ✅ |
| `--name` | `-n` | Nombre de la muñeca | ❌ (default: "Unnamed Doll") |
| `--variant` | `-v` | Variante de estilo | ❌ (default: "default") |
| `--no-library-update` | N/A | No actualizar partLibrary.json | ❌ |
| `--help` | `-h` | Mostrar ayuda | ❌ |

## Partes Generadas

La herramienta crea 6 partes del cuerpo:

1. **head.png** - Cabeza y cuello
2. **torso.png** - Torso desde cuello hasta cintura
3. **arm_left.png** - Brazo izquierdo
4. **arm_right.png** - Brazo derecho
5. **leg_left.png** - Pierna izquierda
6. **leg_right.png** - Pierna derecha

Además, crea miniaturasde 150x150px para cada parte en el subdirectorio `thumbnails/`.

## Estructura de Salida

```
public/assets/dolls/doll_01/
├── head.png
├── torso.png
├── arm_left.png
├── arm_right.png
├── leg_left.png
├── leg_right.png
└── thumbnails/
    ├── head.png
    ├── torso.png
    ├── arm_left.png
    ├── arm_right.png
    ├── leg_left.png
    └── leg_right.png
```

## Regiones de Segmentación

La herramienta usa porcentajes predefinidos para cortar la imagen:

- **Cabeza**: 0-20% (vertical), 30-70% (horizontal)
- **Torso**: 18-50% (vertical), 25-75% (horizontal)
- **Brazo Izquierdo**: 22-65% (vertical), 0-32% (horizontal)
- **Brazo Derecho**: 22-65% (vertical), 68-100% (horizontal)
- **Pierna Izquierda**: 48-100% (vertical), 30-55% (horizontal)
- **Pierna Derecha**: 48-100% (vertical), 45-70% (horizontal)

## Requisitos de la Imagen de Entrada

Para mejores resultados, la imagen de entrada debe:

- ✅ Ser PNG con fondo transparente
- ✅ Tener la muñeca centrada y de frente
- ✅ Postura vertical y simétrica
- ✅ Brazos ligeramente separados del cuerpo
- ✅ Resolución mínima: 2000px en el lado más largo
- ✅ Iluminación uniforme sin sombras fuertes

## Actualización Automática de partLibrary.json

La herramienta actualiza automáticamente `public/data/partLibrary.json` con:

- Rutas a las imágenes generadas
- Dimensiones de cada parte
- Puntos de anclaje (anchor points)
- Z-index para capas
- Metadata de la muñeca

## Refinamiento Manual

Después de la segmentación automática, se recomienda:

1. **Limpiar bordes** en Photoshop/GIMP
2. **Ajustar puntos de corte** si es necesario
3. **Eliminar artefactos** del fondo original
4. **Verificar transparencia** en todas las partes

## Procesamiento por Lotes

Para procesar múltiples muñecas, crea un script bash:

```bash
#!/bin/bash

node tools/segmentDoll.js -i public/assets/source/doll_01.png -o public/assets/dolls/doll_01 -n "Muñeca Clásica" -v "classic"
node tools/segmentDoll.js -i public/assets/source/doll_02.png -o public/assets/dolls/doll_02 -n "Muñeca Moderna" -v "modern"
node tools/segmentDoll.js -i public/assets/source/doll_03.png -o public/assets/dolls/doll_03 -n "Muñeca Vintage" -v "vintage"
```

## Solución de Problemas

### Error: "sharp not found"
```bash
npm install sharp
```

### Error: "partLibrary.json not found"
La herramienta creará el archivo automáticamente.

### Partes mal alineadas
Ajusta los porcentajes en `SEGMENTS` dentro de `segmentDoll.js` según las proporciones de tu imagen.

### Calidad baja
Asegúrate de que la imagen de entrada tenga alta resolución (mínimo 2000px).
