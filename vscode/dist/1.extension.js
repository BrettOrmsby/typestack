"use strict";
exports.id = 1;
exports.ids = [1];
exports.modules = {

/***/ 12:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _stack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);

const date = {
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int]: {
        now: {
            params: {},
            rawCode: (stacks) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(Date.now());
            },
        },
        getTimezoneOffset: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getTimezoneOffset());
            },
        },
        getDate: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getDate());
            },
        },
        getDay: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getDay());
            },
        },
        getYear: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getFullYear());
            },
        },
        getHours: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getHours());
            },
        },
        getMilliseconds: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getMilliseconds());
            },
        },
        getMinutes: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getMinutes());
            },
        },
        getMonth: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getMonth());
            },
        },
        getSeconds: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getSeconds());
            },
        },
        getUTCDate: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getUTCDate());
            },
        },
        getUTCDay: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getUTCDay());
            },
        },
        getUTCYear: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getUTCFullYear());
            },
        },
        getUTCHours: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getUTCHours());
            },
        },
        getUTCMilliseconds: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getUTCMilliseconds());
            },
        },
        getUTCMinutes: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getUTCMinutes());
            },
        },
        getUTCMonth: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getUTCMonth());
            },
        },
        getUTCSeconds: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(date.getUTCSeconds());
            },
        },
        setDate: {
            params: { day: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setDate(params.day);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setFullYear: {
            params: { year: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setFullYear(params.year);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setHours: {
            params: { hour: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setHours(params.hour);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setMilliseconds: {
            params: { millisecond: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setMilliseconds(params.millisecond);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setMinutes: {
            params: { minute: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setMinutes(params.minutes);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setMonth: {
            params: { month: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setMonth(params.month);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setSeconds: {
            params: { second: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setSeconds(params.second);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setUTCDate: {
            params: { day: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCDate(params.day);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setUTCFullYear: {
            params: { year: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCFullYear(params.year);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setUTCHours: {
            params: { hour: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCHours(params.hour);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        seUTCMilliseconds: {
            params: { millisecond: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCMilliseconds(params.millisecond);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setUTCMinutes: {
            params: { minute: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCMinutes(params.minutes);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setUTCMonth: {
            params: { month: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCMonth(params.month);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        setUTCSeconds: {
            params: { second: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCSeconds(params.second);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(newDate);
            },
        },
        toStr: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(date.toString());
            },
        },
        toDateStr: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(date.toDateString());
            },
        },
        toISOStr: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(date.toISOString());
            },
        },
        toUTCStr: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(date.toUTCString());
            },
        },
        toTimeStr: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(date.toTimeString());
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float]: {},
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str]: {
        parse: {
            params: { date: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                const date = Date.parse(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(Date.parse(params.date));
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool]: {},
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any]: {},
};
function isValidDate(d) {
    return typeof d === "number" ? !isNaN(d) : !isNaN(d.getDate());
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (date);


/***/ })

};
;
//# sourceMappingURL=1.extension.js.map