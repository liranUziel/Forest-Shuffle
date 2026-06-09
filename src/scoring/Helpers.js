export const Helpers = {
    normalizeName(value) {
        const normalized = String(value || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');

        const aliases = {
            fireflies: 'firefly',
            blacberries: 'blackberries',
            wild_stawberries: 'wild_strawberries',
            coomon_toad: 'common_toad',
            commond_toad: 'common_toad',
            squeaker: 'squeeker',
            european_badger: 'badger',
            silver_washed_fritllary: 'silver_washed_fritillary',
            sliver_washed_fritllary: 'silver_washed_fritillary',
            large_trotiseshell: 'large_tortoiseshell',
            large_trotoiseshell: 'large_tortoiseshell',
            large_tortoieseshell: 'large_tortoiseshell'
        };

        return aliases[normalized] || normalized;
    },

    normalizeTreeSpeciesId(value) {
        const normalized = Helpers.normalizeName(value);
        const aliases = {
            silver_birch: 'birch'
        };
        return aliases[normalized] || normalized;
    }
};