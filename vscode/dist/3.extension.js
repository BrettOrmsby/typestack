"use strict";
exports.id = 3;
exports.ids = [3];
exports.modules = {

/***/ 17:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const str = {
    int: {
        fromCharCode: {
            params: { code: "int" },
            rawCode: (stacks, params) => {
                stacks.str.push(String.fromCharCode(params.code));
            },
        },
        fromCodePoint: {
            params: { code: "int" },
            rawCode: (stacks, params) => {
                let char;
                try {
                    char = String.fromCharCode(params.code);
                }
                catch (e) {
                    return new Error(`\`code\` is an invalid code point: \`${params.code}\``);
                }
                stacks.str.push(char);
            },
        },
        repeat: {
            params: { string: "str", amount: "int" },
            rawCode: (stacks, params) => {
                if (params.amount < 0) {
                    return new Error(`unable to repeat a negative \`amount\`: \`${params.amount}\``);
                }
                stacks.str.push(params.string.repeat(params.amount));
            },
        },
        charAt: {
            params: { string: "str", index: "int" },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.charAt(params.index));
            },
        },
        charCodeAt: {
            params: { string: "str", index: "int" },
            rawCode: (stacks, params) => {
                const code = params.string.charCodeAt(params.index);
                if (isNaN(code)) {
                    return new Error(`\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``);
                }
                stacks.int.push(code);
            },
        },
        codePointAt: {
            params: { string: "str", index: "int" },
            rawCode: (stacks, params) => {
                const code = params.string.codePointAt(params.index);
                if (!code) {
                    return new Error(`\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``);
                }
                stacks.int.push(code);
            },
        },
        slice: {
            params: {
                string: "str",
                endIndex: "int",
                startIndex: "int",
            },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.slice(params.startIndex, params.endIndex));
            },
        },
    },
    float: {},
    str: {
        endsWith: {
            params: { end: "str", string: "str" },
            rawCode: (stacks, params) => {
                stacks.bool.push(params.string.endsWith(params.end));
            },
        },
        startsWith: {
            params: { start: "str", string: "str" },
            rawCode: (stacks, params) => {
                stacks.bool.push(params.string.startsWith(params.start));
            },
        },
        includes: {
            params: { search: "str", string: "str" },
            rawCode: (stacks, params) => {
                stacks.bool.push(params.string.includes(params.search));
            },
        },
        occurrence: {
            params: { search: "str", string: "str" },
            rawCode: (stacks, params) => {
                stacks.int.push(params.string.split(params.search).length - 1);
            },
        },
        toUpper: {
            params: { string: "str" },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.toUpperCase());
            },
        },
        toLower: {
            params: { string: "str" },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.toLowerCase());
            },
        },
        trim: {
            params: { string: "str" },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.trim());
            },
        },
        reverse: {
            params: { string: "str" },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.split("").reverse().join(""));
            },
        },
        replace: {
            params: {
                replacement: "str",
                search: "str",
                string: "str",
            },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.replace(params.search, params.replacement));
            },
        },
        replaceAll: {
            params: {
                replacement: "str",
                search: "str",
                string: "str",
            },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.replaceAll(params.search, params.replacement));
            },
        },
        repeat: {
            params: { string: "str", amount: "int" },
            rawCode: (stacks, params) => {
                if (params.amount < 0) {
                    return new Error(`unable to repeat a negative \`amount\`: \`${params.amount}\``);
                }
                stacks.str.push(params.string.repeat(params.amount));
            },
        },
        indexOf: {
            params: { search: "str", string: "str" },
            rawCode: (stacks, params) => {
                stacks.int.push(params.string.indexOf(params.search));
            },
        },
        lastIndexOf: {
            params: { search: "str", string: "str" },
            rawCode: (stacks, params) => {
                stacks.int.push(params.string.lastIndexOf(params.search));
            },
        },
        charAt: {
            params: { string: "str", index: "int" },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.charAt(params.index));
            },
        },
        charCodeAt: {
            params: { string: "str", index: "int" },
            rawCode: (stacks, params) => {
                const code = params.string.charCodeAt(params.index);
                if (isNaN(code)) {
                    return new Error(`\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``);
                }
                stacks.int.push(code);
            },
        },
        codePointAt: {
            params: { string: "str", index: "int" },
            rawCode: (stacks, params) => {
                const code = params.string.codePointAt(params.index);
                if (!code) {
                    return new Error(`\`index\` out of range: \`"${params.string}"\`, \`${params.index}\``);
                }
                stacks.int.push(code);
            },
        },
        slice: {
            params: {
                string: "str",
                endIndex: "int",
                startIndex: "int",
            },
            rawCode: (stacks, params) => {
                stacks.str.push(params.string.slice(params.startIndex, params.endIndex));
            },
        },
        split: {
            params: { separator: "str", string: "str" },
            rawCode: (stacks, params) => {
                params.string
                    .split(params.separator)
                    .forEach((e) => stacks.str.push(e));
            },
        },
    },
    bool: {},
    any: {},
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (str);


/***/ })

};
;
//# sourceMappingURL=3.extension.js.map