class FontRegistry {
    fontsMap = new Map();
    aliasMap = new Map();
    /**
     * Registers a list of fonts into the registry
     */
    registerAll(fonts) {
        for (const font of fonts) {
            this.register(font);
        }
    }
    /**
     * Registers a single font into the registry
     */
    register(font) {
        this.fontsMap.set(font.id, font);
        if (font.aliases) {
            for (const alias of font.aliases) {
                this.aliasMap.set(alias.toLowerCase(), font.id);
            }
        }
    }
    /**
     * Looks up a font by its id or alias
     */
    get(idOrAlias) {
        if (!idOrAlias)
            return undefined;
        const direct = this.fontsMap.get(idOrAlias);
        if (direct)
            return direct;
        const lower = idOrAlias.toLowerCase();
        const resolvedId = this.aliasMap.get(lower);
        if (resolvedId) {
            return this.fontsMap.get(resolvedId);
        }
        // Try finding by normalized id
        const normalized = lower.replace(/[\s_]+/g, '-');
        return this.fontsMap.get(normalized);
    }
    /**
     * Lists all registered fonts with optional filters
     */
    list(filter) {
        let result = Array.from(this.fontsMap.values());
        if (filter?.category) {
            result = result.filter(f => f.category === filter.category);
        }
        if (filter?.weight) {
            result = result.filter(f => f.weights.includes(filter.weight));
        }
        if (filter?.hasStyle) {
            result = result.filter(f => f.styles.includes(filter.hasStyle));
        }
        return result;
    }
    /**
     * Returns the count of registered fonts
     */
    size() {
        return this.fontsMap.size;
    }
}
export const globalRegistry = new FontRegistry();
export function getFont(id) {
    return globalRegistry.get(id);
}
export function listFonts(filter) {
    return globalRegistry.list(filter);
}
export function getFontFamily(id) {
    return globalRegistry.get(id)?.family;
}
//# sourceMappingURL=registry.js.map