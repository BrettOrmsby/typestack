"use strict";
exports.id = 1;
exports.ids = [1];
exports.modules = {

/***/ 15:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const date = {
    int: {
        now: {
            params: {},
            rawCode: (stacks) => {
                stacks.int.push(Date.now());
            },
        },
        getTimezoneOffset: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getTimezoneOffset());
            },
        },
        getDate: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getDate());
            },
        },
        getDay: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getDay());
            },
        },
        getYear: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getFullYear());
            },
        },
        getHours: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getHours());
            },
        },
        getMilliseconds: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getMilliseconds());
            },
        },
        getMinutes: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getMinutes());
            },
        },
        getMonth: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getMonth());
            },
        },
        getSeconds: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getSeconds());
            },
        },
        getUTCDate: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getUTCDate());
            },
        },
        getUTCDay: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getUTCDay());
            },
        },
        getUTCYear: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getUTCFullYear());
            },
        },
        getUTCHours: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getUTCHours());
            },
        },
        getUTCMilliseconds: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getUTCMilliseconds());
            },
        },
        getUTCMinutes: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getUTCMinutes());
            },
        },
        getUTCMonth: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getUTCMonth());
            },
        },
        getUTCSeconds: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(date.getUTCSeconds());
            },
        },
        setDate: {
            params: { day: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setDate(params.day);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setFullYear: {
            params: { year: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setFullYear(params.year);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setHours: {
            params: { hour: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setHours(params.hour);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setMilliseconds: {
            params: { millisecond: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setMilliseconds(params.millisecond);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setMinutes: {
            params: { minute: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setMinutes(params.minutes);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setMonth: {
            params: { month: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setMonth(params.month);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setSeconds: {
            params: { second: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setSeconds(params.second);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setUTCDate: {
            params: { day: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCDate(params.day);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setUTCFullYear: {
            params: { year: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCFullYear(params.year);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setUTCHours: {
            params: { hour: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCHours(params.hour);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        seUTCMilliseconds: {
            params: { millisecond: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCMilliseconds(params.millisecond);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setUTCMinutes: {
            params: { minute: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCMinutes(params.minutes);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setUTCMonth: {
            params: { month: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCMonth(params.month);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        setUTCSeconds: {
            params: { second: "int", date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                const newDate = date.setUTCSeconds(params.second);
                if (!isValidDate(newDate)) {
                    return new Error("invalid date created");
                }
                stacks.int.push(newDate);
            },
        },
        toStr: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.str.push(date.toString());
            },
        },
        toDateStr: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.str.push(date.toDateString());
            },
        },
        toISOStr: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.str.push(date.toISOString());
            },
        },
        toUTCStr: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.str.push(date.toUTCString());
            },
        },
        toTimeStr: {
            params: { date: "int" },
            rawCode: (stacks, params) => {
                const date = new Date(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.str.push(date.toTimeString());
            },
        },
    },
    float: {},
    str: {
        parse: {
            params: { date: "str" },
            rawCode: (stacks, params) => {
                const date = Date.parse(params.date);
                if (!isValidDate(date)) {
                    return new Error(`unable to convert to a date: \`${params.date}\``);
                }
                stacks.int.push(Date.parse(params.date));
            },
        },
    },
    bool: {},
    any: {},
};
function isValidDate(d) {
    return typeof d === "number" ? !isNaN(d) : !isNaN(d.getDate());
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (date);


/***/ })

};
;
//# sourceMappingURL=1.extension.js.map