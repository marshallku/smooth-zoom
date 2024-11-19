/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        coverage: {
            enabled: true,
            provider: "custom",
            customProviderModule: "vitest-monocart-coverage",
        },
    },
});
