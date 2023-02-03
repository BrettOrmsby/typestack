"use strict";
exports.id = 3;
exports.ids = [3];
exports.modules = {

/***/ 14:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);

const str = {
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int]: {
        fromCharCode: {
            params: { code: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(String.fromCharCode(params.code));
            },
        },
        fromCodePoint: {
            params: { code: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                let char;
                try {
                    char = String.fromCharCode(params.code);
                }
                catch (e) {
                    return new Error(`\`code\` is an invalid code point: \`${params.code}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(char);
            },
        },
        repeat: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, amount: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                if (params.amount < 0) {
                    return new Error(`unable to repeat a negative \`amount\`: \`${params.amount}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.repeat(params.amount));
            },
        },
        charAt: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, index: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.charAt(params.index));
            },
        },
        charCodeAt: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, index: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const code = params.string.charCodeAt(params.index);
                if (isNaN(code)) {
                    return new Error(`\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(code);
            },
        },
        codePointAt: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, index: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const code = params.string.codePointAt(params.index);
                if (!code) {
                    return new Error(`\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(code);
            },
        },
        slice: {
            params: {
                string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str,
                endIndex: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int,
                startIndex: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int,
            },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.slice(params.startIndex, params.endIndex));
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float]: {},
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str]: {
        endsWith: {
            params: { end: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.string.endsWith(params.end));
            },
        },
        startsWith: {
            params: { start: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.string.startsWith(params.start));
            },
        },
        includes: {
            params: { search: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.string.includes(params.search));
            },
        },
        occurrence: {
            params: { search: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.string.split(params.search).length - 1);
            },
        },
        toUpper: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.toUpperCase());
            },
        },
        toLower: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.toLowerCase());
            },
        },
        trim: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.trim());
            },
        },
        reverse: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.split("").reverse().join(""));
            },
        },
        replace: {
            params: {
                replacement: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str,
                search: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str,
                string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str,
            },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.replace(params.search, params.replacement));
            },
        },
        replaceAll: {
            params: {
                replacement: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str,
                search: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str,
                string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str,
            },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.replaceAll(params.search, params.replacement));
            },
        },
        repeat: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, amount: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                if (params.amount < 0) {
                    return new Error(`unable to repeat a negative \`amount\`: \`${params.amount}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.repeat(params.amount));
            },
        },
        indexOf: {
            params: { search: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.string.indexOf(params.search));
            },
        },
        lastIndexOf: {
            params: { search: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.string.lastIndexOf(params.search));
            },
        },
        charAt: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, index: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.charAt(params.index));
            },
        },
        charCodeAt: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, index: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const code = params.string.charCodeAt(params.index);
                if (isNaN(code)) {
                    return new Error(`\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(code);
            },
        },
        codePointAt: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, index: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const code = params.string.codePointAt(params.index);
                if (!code) {
                    return new Error(`\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(code);
            },
        },
        slice: {
            params: {
                string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str,
                endIndex: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int,
                startIndex: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int,
            },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.string.slice(params.startIndex, params.endIndex));
            },
        },
        split: {
            params: { separator: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                params.string
                    .split(params.separator)
                    .forEach((e) => stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(e));
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool]: {},
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any]: {},
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (str);


/***/ })

};
;
//# sourceMappingURL=3.extension.js.map