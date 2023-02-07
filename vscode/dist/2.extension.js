"use strict";
exports.id = 2;
exports.ids = [2];
exports.modules = {

/***/ 18:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const math = {
    int: {
        abs: {
            params: { num: "int" },
            rawCode: (stacks, params) => {
                stacks.int.push(Math.abs(params.num));
            },
        },
        neg: {
            params: { num: "int" },
            rawCode: (stacks, params) => {
                stacks.int.push(-params.num);
            },
        },
    },
    float: {
        ceil: {
            params: { num: "float" },
            rawCode: (stacks, params) => {
                stacks.int.push(Math.ceil(params.num));
            },
        },
        floor: {
            params: { num: "float" },
            rawCode: (stacks, params) => {
                stacks.int.push(Math.floor(params.num));
            },
        },
        round: {
            params: { num: "float" },
            rawCode: (stacks, params) => {
                stacks.int.push(Math.round(params.num));
            },
        },
        abs: {
            params: { num: "float" },
            rawCode: (stacks, params) => {
                stacks.float.push(Math.abs(params.num));
            },
        },
        neg: {
            params: { num: "float" },
            rawCode: (stacks, params) => {
                stacks.float.push(-params.num);
            },
        },
    },
    str: {},
    bool: {},
    any: {},
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (math);


/***/ })

};
;
//# sourceMappingURL=2.extension.js.map