export default {
    name: "Smooth Zoom coverage report",

    reports: ["console-details", "v8"],
    lcov: true,

    outputDir: "coverage",

    onEnd(results) {
        console.log(`coverage report generated: ${results.reportPath}`);
    },
};
