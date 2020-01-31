module.exports = {
    syntax: "postcss-scss",
    plugins: {
        "postcss-easy-import": {
            extensions: '.pcss'
        },
        "postcss-preset-env": {
            stage: 0,
            autoprefixer: { grid: true }
        },
        "postcss-functions": {
            functions: {
                w: function(px, width = 1920) {
                    return px / (width / 100) + "rem";
                },
                wm: function(px, width = 375) {
                    return px / (width / 100) + "rem";
                }
            }
        },
        "postcss-advanced-variables": { unresolved: "ignore" },
        "postcss-nested": {},
        cssnano: {
            preset: "default"
        }
    }
};
