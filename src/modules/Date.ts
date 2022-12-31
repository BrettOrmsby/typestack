import { type StackFunctions } from "../functions.js";
import { StackType } from "../stack.js";

const date: StackFunctions = {
  [StackType.Int]: {
    now: {
      params: {},
      rawCode: (stacks) => {
        stacks[StackType.Int].push(Date.now());
      },
    },
    getTimezoneOffset: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getTimezoneOffset());
      },
    },
    getDate: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getDate());
      },
    },
    getDay: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getDay());
      },
    },
    getYear: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getFullYear());
      },
    },
    getHours: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getHours());
      },
    },
    getMilliseconds: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getMilliseconds());
      },
    },
    getMinutes: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getMinutes());
      },
    },
    getMonth: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getMonth());
      },
    },
    getSeconds: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getSeconds());
      },
    },
    getUTCDate: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getUTCDate());
      },
    },
    getUTCDay: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getUTCDay());
      },
    },
    getUTCYear: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getUTCFullYear());
      },
    },
    getUTCHours: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getUTCHours());
      },
    },
    getUTCMilliseconds: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getUTCMilliseconds());
      },
    },
    getUTCMinutes: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getUTCMinutes());
      },
    },
    getUTCMonth: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getUTCMonth());
      },
    },
    getUTCSeconds: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(date.getUTCSeconds());
      },
    },
    setDate: {
      params: { day: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setDate(params.day);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setFullYear: {
      params: { year: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setFullYear(params.year);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setHours: {
      params: { hour: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setHours(params.hour);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setMilliseconds: {
      params: { millisecond: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setMilliseconds(params.millisecond);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setMinutes: {
      params: { minute: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setMinutes(params.minutes);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setMonth: {
      params: { month: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setMonth(params.month);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setSeconds: {
      params: { second: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setSeconds(params.second);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setUTCDate: {
      params: { day: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setUTCDate(params.day);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setUTCFullYear: {
      params: { year: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setUTCFullYear(params.year);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setUTCHours: {
      params: { hour: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setUTCHours(params.hour);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    seUTCMilliseconds: {
      params: { millisecond: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setUTCMilliseconds(params.millisecond);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setUTCMinutes: {
      params: { minute: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setUTCMinutes(params.minutes);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setUTCMonth: {
      params: { month: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setUTCMonth(params.month);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    setUTCSeconds: {
      params: { second: StackType.Int, date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        const newDate = date.setUTCSeconds(params.second);
        if (!isValidDate(newDate)) {
          return new Error("invalid date created");
        }
        stacks[StackType.Int].push(newDate);
      },
    },
    toStr: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);

        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Str].push(date.toString());
      },
    },
    toDateStr: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);

        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Str].push(date.toDateString());
      },
    },
    toISOStr: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);

        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Str].push(date.toISOString());
      },
    },
    toUTCStr: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);

        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Str].push(date.toUTCString());
      },
    },
    toTimeStr: {
      params: { date: StackType.Int },
      rawCode: (stacks, params) => {
        const date = new Date(params.date);

        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Str].push(date.toTimeString());
      },
    },
  },
  [StackType.Float]: {},
  [StackType.Str]: {
    parse: {
      params: { date: StackType.Str },
      rawCode: (stacks, params) => {
        const date = Date.parse(params.date);
        if (!isValidDate(date)) {
          return new Error(`unable to convert to a date: \`${params.date}\``);
        }
        stacks[StackType.Int].push(Date.parse(params.date));
      },
    },
  },
  [StackType.Bool]: {},
  [StackType.Any]: {},
};

function isValidDate(d: number | Date) {
  return typeof d === "number" ? !isNaN(d) : !isNaN(d.getDate());
}

export default date;
