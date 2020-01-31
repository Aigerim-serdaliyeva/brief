module.exports = {
    outputDir: "../prod/public",
    devServer: {
        proxy: "http://localhost:3000"
    },
    publicPath: process.env.NODE_ENV === "production" ? "/" : "/"
};

// const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminPngquant = require('imagemin-pngquant');
// const imageminSvgo = require('imagemin-svgo');

// (async () => {
// 	const files = await imagemin(['src/assets/images/*.{jpg,png,svg}'], 'build/images', {
// 		plugins: [
// 			imageminJpegtran(),
// 			imageminPngquant({
// 				quality: [0.8, 1]
//             }),
//             imageminSvgo({
//                 plugins: [
//                     {removeViewBox: false}
//                 ]
//             })
// 		]
// 	});

// 	console.log(files);
// })();
