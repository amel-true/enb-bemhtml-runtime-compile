/**
 * enb-bemhtml-runtime-compile
 * ==================
 *
 * Склеивает все bemhtml файлы в проекте в один и оборачивает в BEMHTML.compile().
 *
 * Компиляция вызывается через на следующий тик, для того, чтобы bemhtml успел проициализироваться
 * **Опции**
 * *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
 * (его предоставляет технология `files`). По умолчанию — `?.files`.
 *
 * **Пример**
 * ```javascript
 * [ require('enb-bemhtml-runtime-compile/techs/bemhtml-runtime-compile'), {
 *    filesTarget: '?.bemhtml.files'
 * } ]
 * ```
 */
var vowFs = require('enb/lib/fs/async-fs');
var fs = require('fs');

module.exports = require('enb/lib/build-flow').create()
	.name('bemhtml-no-compile')
	.target('target', '?.bemhtml.js')
	.useFileList(['bemhtml.js'])
	.builder(function (sourceFiles) {
		return Promise.all(sourceFiles.map(function (file) {
			const filename = file.fullname;
			return vowFs.read(filename, 'utf8').then(function (data) {
				const pre = `/* ${filename}: begin */\n`;
				const post = `/*  ${filename} : end */`;
				return `${pre} ${data} ${post}`;
			});
		})).then(function (res) {
			if (res.length > 0) {
				const filename = require.resolve('../lib/nexttick');
				const nextTick = fs.readFileSync(filename);
				res.unshift(`
					${nextTick}
					nextTick( () => {
					 BEMHTML.compile(function() {
				`);
				res.push('})})');
			}
			return res.join('\n');
		});
	})
	.createTech();
