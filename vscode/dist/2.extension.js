"use strict";
exports.id = 2;
exports.ids = [2];
exports.modules = {

/***/ 13:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);

const math = {
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int]: {
        abs: {
            params: { num: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(Math.abs(params.num));
            },
        },
        neg: {
            params: { num: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(-params.num);
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float]: {
        ceil: {
            params: { num: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(Math.ceil(params.num));
            },
        },
        floor: {
            params: { num: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(Math.floor(params.num));
            },
        },
        round: {
            params: { num: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(Math.round(params.num));
            },
        },
        abs: {
            params: { num: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(Math.abs(params.num));
            },
        },
        neg: {
            params: { num: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(-params.num);
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str]: {},
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool]: {},
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any]: {},
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (math);


/***/ })

};
;
//# sourceMappingURL=2.extension.js.map