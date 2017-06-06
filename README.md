# enb-bemhtml-runtime-compile

Склеивает все bemhtml файлы в проекте в один и оборачивает в BEMHTML.compile().
Компиляция вызывается через на следующий тик, для того, чтобы bemhtml успел проициализироваться

## Установка

``` npm i enb-bemhtml-runtime-compile ```

## Использование 

**Опции**

* *String* **filesTarget** — files-таргет, на основе которого получается список исходных файлов
  (его предоставляет технология `files`). По умолчанию — `?.files`.

**Пример**

```javascript
[ require('enb-bemhtml-runtime-compile/techs/bemhtml-runtime-compile'), {
	filesTarget: '?.bemhtml.files'
} ]
```