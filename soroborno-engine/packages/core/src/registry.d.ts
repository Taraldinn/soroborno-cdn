import type { FontMetadata } from './types.js';
declare class FontRegistry {
    private fontsMap;
    private aliasMap;
    /**
     * Registers a list of fonts into the registry
     */
    registerAll(fonts: FontMetadata[]): void;
    /**
     * Registers a single font into the registry
     */
    register(font: FontMetadata): void;
    /**
     * Looks up a font by its id or alias
     */
    get(idOrAlias: string): FontMetadata | undefined;
    /**
     * Lists all registered fonts with optional filters
     */
    list(filter?: {
        category?: string;
        weight?: number;
        hasStyle?: string;
    }): FontMetadata[];
    /**
     * Returns the count of registered fonts
     */
    size(): number;
}
export declare const globalRegistry: FontRegistry;
export declare function getFont(id: string): FontMetadata | undefined;
export declare function listFonts(filter?: {
    category?: string;
    weight?: number;
}): FontMetadata[];
export declare function getFontFamily(id: string): string | undefined;
export {};
//# sourceMappingURL=registry.d.ts.map