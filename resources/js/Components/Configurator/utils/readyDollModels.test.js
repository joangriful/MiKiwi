import assert from 'node:assert/strict';
import { buildReadyDollModels, DEFAULT_READY_DOLL_MODELS } from './readyDollModels.js';

function run(name, fn) {
    try {
        fn();
        process.stdout.write(`PASS ${name}\n`);
    } catch (error) {
        console.error(`FAIL ${name}`);
        throw error;
    }
}

run('buildReadyDollModels uses seeded product names and slugs by SKU', () => {
    const models = buildReadyDollModels([
        { sku: 'DOLL-HAT-001', name: 'Hat', slug: 'hat-doll' },
        { sku: 'DOLL-BIKINI-001', name: 'Bikini', slug: 'bikini-doll' },
    ]);

    const hat = models.find((model) => model.productSku === 'DOLL-HAT-001');
    const bikini = models.find((model) => model.productSku === 'DOLL-BIKINI-001');

    assert.equal(hat.name, 'Hat');
    assert.equal(hat.productSlug, 'hat-doll');
    assert.equal(bikini.name, 'Bikini');
    assert.equal(bikini.productSlug, 'bikini-doll');
});

run('buildReadyDollModels preserves 3D model configuration and fallbacks', () => {
    const models = buildReadyDollModels([]);

    assert.deepEqual(models, DEFAULT_READY_DOLL_MODELS);
    assert.equal(models[0].path, '/models/naked-queen/source/NakedQueen.fbx');
    assert.equal(models[0].productSlug, 'queen-doll');
});
