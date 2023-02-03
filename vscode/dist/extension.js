/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.subscribeToDocumentChanges = exports.refreshDiagnostics = void 0;
const vscode = __webpack_require__(1);
const scan_1 = __webpack_require__(3);
const parse_1 = __webpack_require__(6);
const typeCheck_1 = __webpack_require__(9);
const functions_1 = __webpack_require__(10);
const error_1 = __webpack_require__(4);
async function refreshDiagnostics(doc, diagnosticCollection) {
    const diagnostics = [];
    const fileText = doc.getText();
    const errors = await getErrors(fileText);
    if (errors) {
        if (errors instanceof error_1.TSError) {
            diagnostics.push(createDiagnostic(doc, errors));
        }
        else {
            errors.forEach(error => {
                diagnostics.push(createDiagnostic(doc, error));
            });
        }
    }
    diagnosticCollection.set(doc.uri, diagnostics);
}
exports.refreshDiagnostics = refreshDiagnostics;
function createDiagnostic(doc, error) {
    // do the error parsing here
    const index = 1;
    // create range that represents, where in the document the word is
    const range = new vscode.Range(1, index, 1, index + 6);
    const diagnostic = new vscode.Diagnostic(range, error.error, vscode.DiagnosticSeverity.Error);
    diagnostic.code = "typestack";
    console.log(diagnostic);
    return diagnostic;
}
function subscribeToDocumentChanges(context, diagnosticCollection) {
    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            refreshDiagnostics(editor.document, diagnosticCollection);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => refreshDiagnostics(e.document, diagnosticCollection)));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument(doc => diagnosticCollection.delete(doc.uri)));
}
exports.subscribeToDocumentChanges = subscribeToDocumentChanges;
async function getErrors(text) {
    const scanner = new scan_1.Scanner(text, console.log);
    const scanError = scanner.scan();
    if (scanError instanceof error_1.TSError) {
        return scanError;
    }
    const parser = new parse_1.Parser(scanner.tokens, functions_1.standardLibraryFunctions);
    const parseError = await parser.parse();
    expect(parseError).not.toBeInstanceOf(error_1.TSError);
    if (parseError instanceof error_1.TSError) {
        return parseError;
    }
    return (0, typeCheck_1.default)(parser.program, functions_1.standardLibraryFunctions, parser.newFunctions);
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Scanner": () => (/* binding */ Scanner),
/* harmony export */   "TokenType": () => (/* binding */ TokenType)
/* harmony export */ });
/* harmony import */ var _utils_error_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* TODO: fix this error with any type params that auto go to the type of function
fn combineStr(top second) @str {
    top + second
}
*/

var TokenType;
(function (TokenType) {
    TokenType[TokenType["Int"] = 0] = "Int";
    TokenType[TokenType["Float"] = 1] = "Float";
    TokenType[TokenType["Str"] = 2] = "Str";
    TokenType[TokenType["Bool"] = 3] = "Bool";
    TokenType[TokenType["Keyword"] = 4] = "Keyword";
    TokenType[TokenType["Identifier"] = 5] = "Identifier";
    TokenType[TokenType["Colon"] = 6] = "Colon";
    TokenType[TokenType["OpenParen"] = 7] = "OpenParen";
    TokenType[TokenType["CloseParen"] = 8] = "CloseParen";
    TokenType[TokenType["OpenBracket"] = 9] = "OpenBracket";
    TokenType[TokenType["CloseBracket"] = 10] = "CloseBracket";
    TokenType[TokenType["EOF"] = 11] = "EOF";
})(TokenType || (TokenType = {}));
class Scanner {
    input;
    tokens;
    pointer;
    char;
    line;
    constructor(input, consoleFunc) {
        input = input.trimEnd();
        _utils_error_js__WEBPACK_IMPORTED_MODULE_0__.ErrorInputConfig.input = input;
        _utils_error_js__WEBPACK_IMPORTED_MODULE_0__.ErrorInputConfig.consoleFunc = consoleFunc;
        this.input = input;
        this.tokens = [];
        this.pointer = 0;
        this.char = 1;
        this.line = 1;
    }
    scan() {
        while (!this.#isAtEnd()) {
            const current = this.#peek();
            if (["(", ")", "{", "}", ":"].includes(current)) {
                switch (current) {
                    case "(":
                        this.#addToken(TokenType.OpenParen, "(");
                        break;
                    case ")":
                        this.#addToken(TokenType.CloseParen, ")");
                        break;
                    case "{":
                        this.#addToken(TokenType.OpenBracket, "{");
                        break;
                    case "}":
                        this.#addToken(TokenType.CloseBracket, "}");
                        break;
                    case ":":
                        this.#addToken(TokenType.Colon, ":");
                }
                this.#increment();
                continue;
            }
            if ("#" === current) {
                while (!this.#isAtEnd() && this.#peek() !== "\n") {
                    this.#increment();
                }
                continue;
            }
            if ([" ", "\t", "\r"].includes(current)) {
                this.#increment();
                continue;
            }
            if ("\n" === current) {
                this.#newline();
                continue;
            }
            if ('"' === current) {
                const startPos = {
                    line: this.line,
                    char: this.char,
                };
                this.#increment();
                let str = "";
                while (!this.#isAtEnd() && this.#peek() !== '"') {
                    if (this.#peek() === "\\") {
                        this.#increment();
                        if (this.#peek() === "\\") {
                            str += "\\";
                        }
                        else if (this.#peek() === "n") {
                            str += "\n";
                        }
                        else if (this.#peek() === "r") {
                            str += "\r";
                        }
                        else if (this.#peek() === "t") {
                            str += "\t";
                        }
                        else if (this.#peek() === '"') {
                            str += '"';
                        }
                        else {
                            return new _utils_error_js__WEBPACK_IMPORTED_MODULE_0__.TSError({
                                startPos: { line: this.line, char: this.char - 1 },
                                endPos: { line: this.line, char: this.char + 1 },
                            }, "unknown escape code");
                        }
                        this.#increment();
                    }
                    else {
                        str += this.#peek();
                        if (this.#peek() === "\n") {
                            this.#newline();
                        }
                        else {
                            this.#increment();
                        }
                    }
                }
                if (this.#isAtEnd()) {
                    return new _utils_error_js__WEBPACK_IMPORTED_MODULE_0__.TSError({
                        startPos: startPos,
                        endPos: { line: this.line, char: this.char },
                    }, 'expected an ending string literal `"`');
                }
                this.#increment();
                this.#addToken(TokenType.Str, str, startPos);
                const posError = this.#expectSeparator();
                if (posError) {
                    return posError;
                }
                continue;
            }
            if (current >= "0" && current <= "9") {
                const posError = this.#number();
                if (posError) {
                    return posError;
                }
            }
            else {
                this.#identifier();
            }
        }
        this.#increment();
        this.#addToken(TokenType.EOF, false);
    }
    #addToken(type, value, startPos, endPos) {
        startPos = startPos ? startPos : { line: this.line, char: this.char };
        this.tokens.push({
            type,
            value,
            startPos,
            endPos: endPos ? endPos : { line: this.line, char: this.char },
        });
    }
    #isAtEnd() {
        return this.pointer >= this.input.length;
    }
    #peek() {
        return this.input[this.pointer];
    }
    #increment() {
        this.pointer += 1;
        this.char += 1;
    }
    #newline() {
        this.pointer += 1;
        this.line += 1;
        this.char = 1;
    }
    #expectSeparator() {
        if (!this.#isAtEnd() &&
            !["\n", "\r", "\t", " ", "{", "}", "(", ")", ":", "#"].includes(this.#peek())) {
            return new _utils_error_js__WEBPACK_IMPORTED_MODULE_0__.TSError({
                startPos: { line: this.line, char: this.char },
                endPos: { line: this.line, char: this.char },
            }, "Expected separator (`\\n`, `\\r`, `\\t`, ` `, `{`, `}`, `(`, `)`, `:`)`");
        }
    }
    #number() {
        const startPos = {
            line: this.line,
            char: this.char,
        };
        let strOfNumber = "";
        while (!this.#isAtEnd() && this.#peek() >= "0" && this.#peek() <= "9") {
            strOfNumber += this.#peek();
            this.#increment();
        }
        if (!this.#isAtEnd() && this.#peek() === ".") {
            strOfNumber += ".";
            this.#increment();
            while (!this.#isAtEnd() && this.#peek() >= "0" && this.#peek() <= "9") {
                strOfNumber += this.#peek();
                this.#increment();
            }
            const float = parseFloat(strOfNumber);
            if (Number.isNaN(float)) {
                return new _utils_error_js__WEBPACK_IMPORTED_MODULE_0__.TSError({
                    startPos: { line: startPos.line, char: startPos.char },
                    endPos: { line: this.line, char: this.char },
                }, "Unable to parse float");
            }
            this.#addToken(TokenType.Float, float, startPos);
        }
        else {
            const int = parseInt(strOfNumber);
            if (Number.isNaN(int)) {
                return new _utils_error_js__WEBPACK_IMPORTED_MODULE_0__.TSError({
                    startPos: { line: startPos.line, char: startPos.char },
                    endPos: { line: this.line, char: this.char },
                }, "Unable to parse int");
            }
            this.#addToken(TokenType.Int, int, startPos);
        }
        return this.#expectSeparator();
    }
    #identifier() {
        const startPos = {
            line: this.line,
            char: this.char,
        };
        let str = "";
        while (!this.#isAtEnd() &&
            ![" ", "\n", "\t", "\r", ":", "{", "}", "(", ")", "#"].includes(this.#peek())) {
            str += this.#peek();
            this.#increment();
        }
        const keywords = [
            "import",
            "fn",
            "loop",
            "for",
            "while",
            "if",
            "else",
            "break",
            "continue",
            "int",
            "bool",
            "str",
            "float",
            "any",
            "@int",
            "@float",
            "@str",
            "@bool",
            "@any",
        ];
        if (str === "false") {
            this.#addToken(TokenType.Bool, false, startPos);
        }
        else if (str === "true") {
            this.#addToken(TokenType.Bool, true, startPos);
        }
        else if (keywords.includes(str)) {
            this.#addToken(TokenType.Keyword, str, startPos);
        }
        else {
            this.#addToken(TokenType.Identifier, str, startPos);
        }
    }
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ErrorInputConfig": () => (/* binding */ ErrorInputConfig),
/* harmony export */   "TSError": () => (/* binding */ TSError),
/* harmony export */   "isTSError": () => (/* binding */ isTSError)
/* harmony export */ });
/* harmony import */ var _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

const ErrorInputConfig = { input: "", consoleFunc: console.log };
class TSError {
    error;
    constructor(pos, msg, ...params) {
        const MAX_ERROR_WIDTH = 35; // characters on each side of the start of the error
        let replaceNum = -1;
        const formattedMessage = msg.replace(/{}/g, () => {
            replaceNum += 1;
            return params[replaceNum];
        });
        let errorLine = ErrorInputConfig.input.split("\n")[pos.startPos.line - 1];
        let errorStartsAt = pos.startPos.char - 1;
        if (!(errorLine.length < MAX_ERROR_WIDTH * 2 + 1)) {
            let newErrorLine = errorLine[pos.startPos.char - 1];
            const textBefore = errorLine.substring(0, pos.startPos.char - 1);
            const textAfter = errorLine.substring(pos.startPos.char);
            if (textBefore.length >= MAX_ERROR_WIDTH) {
                // need to trim off the start
                errorStartsAt = 4 + MAX_ERROR_WIDTH;
                newErrorLine =
                    (0,_consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.consoleEffect)("... ", _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.Bright, _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.FgBlue) +
                        textBefore.slice(-MAX_ERROR_WIDTH) +
                        newErrorLine;
            }
            if (textAfter.length >= MAX_ERROR_WIDTH) {
                // need to trim off the end
                newErrorLine =
                    newErrorLine +
                        textAfter.slice(0, MAX_ERROR_WIDTH) +
                        (0,_consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.consoleEffect)(" ...", _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.Bright, _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.FgBlue);
            }
            errorLine = newErrorLine;
        }
        let errorLength = pos.endPos.char - pos.startPos.char;
        if (errorLength === 0) {
            errorLength = 1;
        }
        if (pos.startPos.line !== pos.endPos.line) {
            errorLength = MAX_ERROR_WIDTH + 1;
        }
        if (errorLength > MAX_ERROR_WIDTH + 1) {
            errorLength = MAX_ERROR_WIDTH + 1;
        }
        const underline = (0,_consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.consoleEffect)("^".repeat(errorLength), _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.FgRed, _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.Bright);
        const error = (0,_consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.consoleEffect)("error", _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.FgRed, _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.Bright);
        const blueArrow = (0,_consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.consoleEffect)("-->", _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.FgBlue, _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.Bright);
        const bluePipe = (0,_consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.consoleEffect)("|", _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.FgBlue, _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.Bright);
        const blueLineNumber = (0,_consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.consoleEffect)(pos.startPos.line, _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.FgBlue, _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.Bright);
        const lineNumberWidth = pos.startPos.line.toString().length;
        const fullMessage = `
${error}: ${(0,_consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.consoleEffect)(formattedMessage, _consoleEffect_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleEffects.Bright)}
${space(lineNumberWidth + 1)}${blueArrow} ${pos.startPos.line}:${pos.startPos.char}
${space(lineNumberWidth + 1)}${bluePipe}
${blueLineNumber} ${bluePipe} ${errorLine}
${space(lineNumberWidth + 1)}${bluePipe} ${space(errorStartsAt)}${underline}`;
        this.error = fullMessage;
    }
    fire() {
        ErrorInputConfig.consoleFunc(this.error);
    }
}
function isTSError(error) {
    return error instanceof TSError;
}
function space(num) {
    return " ".repeat(num);
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ConsoleEffects": () => (/* binding */ ConsoleEffects),
/* harmony export */   "consoleEffect": () => (/* binding */ consoleEffect)
/* harmony export */ });
var ConsoleEffects;
(function (ConsoleEffects) {
    ConsoleEffects["Reset"] = "\u001B[0m";
    ConsoleEffects["Bright"] = "\u001B[1m";
    ConsoleEffects["Dim"] = "\u001B[2m";
    ConsoleEffects["Underscore"] = "\u001B[4m";
    ConsoleEffects["Blink"] = "\u001B[5m";
    ConsoleEffects["Reverse"] = "\u001B[7m";
    ConsoleEffects["Hidden"] = "\u001B[8m";
    ConsoleEffects["FgBlack"] = "\u001B[30m";
    ConsoleEffects["FgRed"] = "\u001B[31m";
    ConsoleEffects["FgGreen"] = "\u001B[32m";
    ConsoleEffects["FgYellow"] = "\u001B[33m";
    ConsoleEffects["FgBlue"] = "\u001B[34m";
    ConsoleEffects["FgMagenta"] = "\u001B[35m";
    ConsoleEffects["FgCyan"] = "\u001B[36m";
    ConsoleEffects["FgWhite"] = "\u001B[37m";
    ConsoleEffects["BgBlack"] = "\u001B[40m";
    ConsoleEffects["BgRed"] = "\u001B[41m";
    ConsoleEffects["BgGreen"] = "\u001B[42m";
    ConsoleEffects["BgYellow"] = "\u001B[43m";
    ConsoleEffects["BgBlue"] = "\u001B[44m";
    ConsoleEffects["BgMagenta"] = "\u001B[45m";
    ConsoleEffects["BgCyan"] = "\u001B[46m";
    ConsoleEffects["BgWhite"] = "\u001B[47m";
})(ConsoleEffects || (ConsoleEffects = {}));
function consoleEffect(str, ...effects) {
    return `${effects.join("")}${str}${ConsoleEffects.Reset}`;
}


/***/ }),
/* 6 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Parser": () => (/* binding */ Parser),
/* harmony export */   "StatementType": () => (/* binding */ StatementType)
/* harmony export */ });
/* harmony import */ var _scan_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _stack_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _utils_error_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);



var StatementType;
(function (StatementType) {
    StatementType[StatementType["ForLoop"] = 0] = "ForLoop";
    StatementType[StatementType["WhileLoop"] = 1] = "WhileLoop";
    StatementType[StatementType["Loop"] = 2] = "Loop";
    StatementType[StatementType["If"] = 3] = "If";
})(StatementType || (StatementType = {}));
class Parser {
    tokens;
    pointer;
    functions;
    newFunctions;
    program;
    constructor(tokens, functions) {
        this.tokens = tokens;
        this.functions = functions;
        this.newFunctions = [];
        this.pointer = 0;
        this.program = [];
    }
    async parse() {
        const importError = await this.#parseImports();
        if ((0,_utils_error_js__WEBPACK_IMPORTED_MODULE_2__.isTSError)(importError)) {
            return importError;
        }
        const block = this.#parseStatement(true);
        if ((0,_utils_error_js__WEBPACK_IMPORTED_MODULE_2__.isTSError)(block)) {
            return block;
        }
        this.program = block;
    }
    async #parseImports() {
        this.pointer -= 1;
        while (this.pointer < 0 || !this.#isAtEnd()) {
            if (this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword, "import")) {
                if (this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Identifier)) {
                    // dynamically import the file and add the module functions to the functions
                    try {
                        const module = (await __webpack_require__(8)(`./${this.#peek().value}.js`))
                            .default;
                        for (const stack of Object.values(_stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType)) {
                            for (const key in module[stack]) {
                                this.functions[stack][this.#peek().value + "." + key] =
                                    module[stack][key];
                            }
                        }
                    }
                    catch (_) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "unable to import module");
                    }
                }
                else {
                    return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                        startPos: this.#peek().startPos,
                        endPos: this.#peek().endPos,
                    }, "expected an identifier after an `import` keyword");
                }
            }
            else {
                return;
            }
        }
    }
    #parseStatement(isInRoot, isInLoop = false, isInIf = false, isInFunction = false) {
        // increment past the `{` character
        if (!isInRoot) {
            this.#increment();
        }
        const block = [];
        while (!this.#isAtEnd()) {
            const current = this.#peek();
            // Punctuation should not be in the middle of nowhere
            if ([
                _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.OpenBracket,
                _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.CloseParen,
                _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.OpenParen,
                _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Colon,
            ].includes(current.type)) {
                return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                    startPos: current.startPos,
                    endPos: current.endPos,
                }, "unexpected character");
            }
            // literals become expressions
            if ([
                _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Int,
                _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Float,
                _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Str,
                _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Bool,
                _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Identifier,
            ].includes(current.type)) {
                block.push(current);
                this.#increment();
                continue;
            }
            // return the block when hitting a `}` unless in the root witch would be an error
            if (_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.CloseBracket === current.type) {
                if (isInRoot) {
                    return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                        startPos: current.startPos,
                        endPos: current.endPos,
                    }, "unexpected character");
                }
                this.#increment();
                return block;
            }
            if (_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword === current.type) {
                // stack types become expressions
                if (["int", "bool", "str", "float"].includes(current.value)) {
                    block.push(current);
                    this.#increment();
                    continue;
                }
                // At keyword are invalid
                if (["@int", "@bool", "@str", "@float", "@any"].includes(current.value)) {
                    return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                        startPos: current.startPos,
                        endPos: current.endPos,
                    }, "unexpected keyword `{}`. Keyword `{}` must only be found after parameters in a function declaration", current.value, current.value);
                }
                // else is invalid
                if ("else" === current.value) {
                    return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                        startPos: current.startPos,
                        endPos: current.endPos,
                    }, "unexpected keyword `else`. Keyword `else` must only be found after if statements");
                }
                // any can only be found in functions
                if ("any" === current.value) {
                    if (isInFunction) {
                        block.push(current);
                        this.#increment();
                        continue;
                    }
                    else {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: current.startPos,
                            endPos: current.endPos,
                        }, "unexpected keyword `any`. Keyword `any` must only be found in `@any` functions");
                    }
                }
                // break can only be found in loops
                if ("break" === current.value) {
                    if (isInLoop) {
                        block.push(current);
                        this.#increment();
                        continue;
                    }
                    else {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: current.startPos,
                            endPos: current.endPos,
                        }, "unexpected keyword `break`. Keyword `break` must only be found in loops");
                    }
                }
                // continue can only be found in loops
                if ("continue" === current.value) {
                    if (isInLoop) {
                        block.push(current);
                        this.#increment();
                        continue;
                    }
                    else {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: current.startPos,
                            endPos: current.endPos,
                        }, "unexpected keyword `continue`. Keyword `continue` must only be found in loops");
                    }
                }
                // import is invalid unless at th top of the program
                if ("import" === current.value) {
                    return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                        startPos: current.startPos,
                        endPos: current.endPos,
                    }, "unexpected keyword `import`. Keyword `import` must only be found at the top of programs");
                }
                // parsing statements
                if ("loop" === current.value) {
                    const startPos = current.startPos;
                    const endPos = current.endPos;
                    // opening bracket should follow a loop keyword
                    if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.OpenBracket)) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected an opening bracket `{` after a `loop` keyword");
                    }
                    const innerBlock = this.#parseStatement(false, true, isInIf, isInFunction);
                    if ((0,_utils_error_js__WEBPACK_IMPORTED_MODULE_2__.isTSError)(innerBlock)) {
                        return innerBlock;
                    }
                    block.push({
                        startPos,
                        endPos,
                        type: StatementType.Loop,
                        block: innerBlock,
                    });
                    continue;
                }
                if ("for" === current.value) {
                    const startPos = current.startPos;
                    // loop and an opening bracket should follow a for keyword
                    if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword, "loop")) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected a `loop` keyword after a `for` keyword");
                    }
                    const endPos = this.#peek().endPos;
                    if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.OpenBracket)) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected an opening bracket `{` after a `loop` keyword");
                    }
                    const innerBlock = this.#parseStatement(false, true, isInIf, isInFunction);
                    if ((0,_utils_error_js__WEBPACK_IMPORTED_MODULE_2__.isTSError)(innerBlock)) {
                        return innerBlock;
                    }
                    block.push({
                        startPos,
                        endPos,
                        type: StatementType.ForLoop,
                        block: innerBlock,
                    });
                    continue;
                }
                if ("while" === current.value) {
                    const startPos = current.startPos;
                    // loop and an opening bracket should follow a while keyword
                    if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword, "loop")) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected a `loop` keyword after a `while` keyword");
                    }
                    const endPos = this.#peek().endPos;
                    if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.OpenBracket)) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected an opening bracket `{` after a `loop` keyword");
                    }
                    const innerBlock = this.#parseStatement(false, true, isInIf, isInFunction);
                    if ((0,_utils_error_js__WEBPACK_IMPORTED_MODULE_2__.isTSError)(innerBlock)) {
                        return innerBlock;
                    }
                    block.push({
                        startPos,
                        endPos,
                        type: StatementType.WhileLoop,
                        block: innerBlock,
                    });
                    continue;
                }
                if ("if" === current.value) {
                    const startPos = current.startPos;
                    const endPos = current.endPos;
                    // an opening bracket should follow an if
                    if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.OpenBracket)) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected an opening bracket `{` after an `if` keyword");
                    }
                    const innerBlock = this.#parseStatement(false, isInLoop, true, isInFunction);
                    if ((0,_utils_error_js__WEBPACK_IMPORTED_MODULE_2__.isTSError)(innerBlock)) {
                        return innerBlock;
                    }
                    // an optional else keyword can follow with an opening bracket
                    this.pointer -= 1;
                    if (this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword, "else")) {
                        if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.OpenBracket)) {
                            return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                                startPos: this.#peek().startPos,
                                endPos: this.#peek().endPos,
                            }, "expected an opening bracket `{` after an `else` keyword");
                        }
                        const elseBlock = this.#parseStatement(false, isInLoop, true, isInFunction);
                        if ((0,_utils_error_js__WEBPACK_IMPORTED_MODULE_2__.isTSError)(elseBlock)) {
                            return elseBlock;
                        }
                        block.push({
                            startPos,
                            endPos,
                            type: StatementType.If,
                            block: innerBlock,
                            else: elseBlock,
                        });
                        continue;
                    }
                    block.push({
                        startPos,
                        endPos,
                        type: StatementType.If,
                        block: innerBlock,
                    });
                    continue;
                }
                if ("fn" === current.value) {
                    // functions must not be nestled
                    if (!isInRoot) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: current.startPos,
                            endPos: current.endPos,
                        }, "unexpected `fn` keyword. Function declarations must not be nestled in other statements");
                    }
                    // the name of the function (identifier) should follow
                    if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Identifier)) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected an identifier after a `fn` keyword");
                    }
                    const name = this.#peek().value;
                    // an opening parenthesis should follow
                    if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.OpenParen)) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected an opening parenthesis `(` after a function identifier");
                    }
                    const params = {};
                    // get all the parameters from the function
                    while (!this.#isAtEnd() && !this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.CloseParen)) {
                        this.pointer -= 1;
                        if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Identifier)) {
                            return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                                startPos: this.#peek().startPos,
                                endPos: this.#peek().endPos,
                            }, "expected an identifier or closing bracket `)` after a function's opening bracket `(`");
                        }
                        const name = this.#peek().value;
                        // parameters can have a type associated with them separated by a colon
                        if (this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Colon)) {
                            this.#increment();
                            if (this.#peek().type === _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword &&
                                ["int", "str", "float", "bool", "any"].includes(this.#peek().value)) {
                                params[name] = {
                                    int: _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Int,
                                    float: _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Float,
                                    str: _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Str,
                                    bool: _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Bool,
                                    any: _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Any,
                                }[this.#peek().value];
                            }
                            else {
                                return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                                    startPos: this.#peek().startPos,
                                    endPos: this.#peek().endPos,
                                }, "expected a type `int`, `float`, `str`, `bool` or `any` after a colon for a function parameter");
                            }
                        }
                        else {
                            this.pointer -= 1;
                            params[name] = _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Any;
                        }
                    }
                    if (this.#isAtEnd()) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected a closing parenthesis `)`");
                    }
                    let functionType;
                    this.#increment();
                    // a function type should follow
                    if (!this.#isAtEnd() &&
                        this.#peek().type === _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword &&
                        ["@int", "@str", "@float", "@bool", "@any"].includes(this.#peek().value)) {
                        functionType = {
                            "@int": _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Int,
                            "@float": _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Float,
                            "@str": _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Str,
                            "@bool": _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Bool,
                            "@any": _stack_js__WEBPACK_IMPORTED_MODULE_1__.StackType.Any,
                        }[this.#peek().value];
                    }
                    else {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected a `@int`, `@float`, `@str`, `@bool` or `@any` after function parameters");
                    }
                    // finally, a opening bracket is needed
                    if (!this.#expect(_scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.OpenBracket)) {
                        return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                            startPos: this.#peek().startPos,
                            endPos: this.#peek().endPos,
                        }, "expected an opening bracket `{` after a `function` declaration");
                    }
                    const innerBlock = this.#parseStatement(false, isInLoop, isInIf, true);
                    if ((0,_utils_error_js__WEBPACK_IMPORTED_MODULE_2__.isTSError)(innerBlock)) {
                        return innerBlock;
                    }
                    this.newFunctions.push({
                        name,
                        type: functionType,
                    });
                    this.functions[functionType][name] = {
                        params: params,
                        body: innerBlock,
                    };
                    continue;
                }
                return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                    startPos: current.startPos,
                    endPos: current.endPos,
                }, "unknown keyword `{}`", current.value);
            }
            return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                startPos: current.startPos,
                endPos: current.endPos,
            }, "unknown token `{}`", current.value);
        }
        if (this.#isAtEnd() && !isInRoot) {
            return new _utils_error_js__WEBPACK_IMPORTED_MODULE_2__.TSError({
                startPos: this.#peek().startPos,
                endPos: this.#peek().endPos,
            }, "expected an ending bracket `}`");
        }
        return block;
    }
    #isAtEnd() {
        return this.tokens[this.pointer].type === _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.EOF;
    }
    #peek() {
        if (this.#isAtEnd()) {
            return this.tokens[this.tokens.length - 1];
        }
        return this.tokens[this.pointer];
    }
    #increment() {
        this.pointer += 1;
    }
    #expect(type, value) {
        this.#increment();
        if (this.#isAtEnd()) {
            return false;
        }
        return (this.#peek().type === type &&
            (!value || (value && value === this.#peek().value)));
    }
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Stack": () => (/* binding */ Stack),
/* harmony export */   "StackType": () => (/* binding */ StackType),
/* harmony export */   "stacks": () => (/* binding */ stacks)
/* harmony export */ });
var StackType;
(function (StackType) {
    StackType["Int"] = "int";
    StackType["Float"] = "float";
    StackType["Str"] = "str";
    StackType["Bool"] = "bool";
    StackType["Any"] = "any";
})(StackType || (StackType = {}));
class Stack {
    stack;
    constructor() {
        this.stack = [];
    }
    push(t) {
        this.stack.push(t);
    }
    get() {
        return this.stack.pop();
    }
    check() {
        return this.stack.length !== 0;
    }
    peek() {
        return this.stack[this.stack.length - 1];
    }
}
const stacks = {
    [StackType.Int]: new Stack(),
    [StackType.Float]: new Stack(),
    [StackType.Str]: new Stack(),
    [StackType.Bool]: new Stack(),
};


/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./Date.js": [
		12,
		1
	],
	"./Math.js": [
		13,
		2
	],
	"./Str.js": [
		14,
		3
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return __webpack_require__.e(ids[1]).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = 8;
module.exports = webpackAsyncContext;

/***/ }),
/* 9 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ typeCheck)
/* harmony export */ });
/* harmony import */ var _scan_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _stack_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _utils_error_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);




function typeCheck(program, functions, newFunctions) {
    const programTypeErrors = traverseCheckProgram(program, {}, _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Int, functions);
    let functionErrors = [];
    for (const fn of newFunctions) {
        // overload all `any` type parameters to the function type
        const params = { ...functions[fn.type][fn.name].params };
        if (fn.type !== _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Any) {
            for (const param in params) {
                if (params[param] === _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Any) {
                    params[param] = fn.type;
                }
            }
        }
        const functionError = traverseCheckProgram(functions[fn.type][fn.name].body, params, fn.type, functions);
        if (functionError.length > 0) {
            functionErrors = [...functionErrors, ...functionError];
        }
    }
    return [...programTypeErrors, ...functionErrors];
}
function traverseCheckProgram(program, otherIdentifiers, stack, functions) {
    let errors = [];
    for (const item of program) {
        // if it is an expression
        if ("value" in item) {
            if (item.type === _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Identifier) {
                // The identifier must be in the parameters or a function at the current stack, in the any stack or in each individual stack
                const value = item.value;
                if (value in otherIdentifiers) {
                    stack = otherIdentifiers[value];
                }
                else if (!(value in functions[stack] ||
                    value in functions[_stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Any] ||
                    (value in functions[_stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Int] &&
                        value in functions[_stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Float] &&
                        value in functions[_stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Str] &&
                        value in functions[_stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Bool]))) {
                    errors.push(new _utils_error_js__WEBPACK_IMPORTED_MODULE_3__.TSError({
                        startPos: item.startPos,
                        endPos: item.endPos,
                    }, "Attempt to call function not found at stack `{}`", stack));
                }
            }
            else if (item.type === _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Keyword) {
                // certain keywords change the stack
                switch (item.value) {
                    case "int":
                        stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Int;
                        break;
                    case "float":
                        stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Float;
                        break;
                    case "str":
                        stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Str;
                        break;
                    case "bool":
                        stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Bool;
                        break;
                    case "any":
                        stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Any;
                }
                // Type values change the stack
            }
            else if (item.type === _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Int) {
                stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Int;
            }
            else if (item.type === _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Float) {
                stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Float;
            }
            else if (item.type === _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Str) {
                stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Str;
            }
            else if (item.type === _scan_js__WEBPACK_IMPORTED_MODULE_0__.TokenType.Bool) {
                stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Bool;
            }
        }
        else {
            // loops only need to check their block with the current type
            if (item.type === _parse_js__WEBPACK_IMPORTED_MODULE_1__.StatementType.Loop) {
                const result = traverseCheckProgram(item.block, otherIdentifiers, stack, functions);
                if (result.length > 0) {
                    errors = [...errors, ...result];
                }
                // for loops need to check their block with the int type and change to the int type after
            }
            else if (item.type === _parse_js__WEBPACK_IMPORTED_MODULE_1__.StatementType.ForLoop) {
                const result = traverseCheckProgram(item.block, otherIdentifiers, _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Int, functions);
                if (result.length > 0) {
                    errors = [...errors, ...result];
                }
                stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Int;
                // while loops need to check their block with the bool type and change to the bool type after
            }
            else if (item.type === _parse_js__WEBPACK_IMPORTED_MODULE_1__.StatementType.WhileLoop) {
                const result = traverseCheckProgram(item.block, otherIdentifiers, _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Bool, functions);
                if (result.length > 0) {
                    errors = [...errors, ...result];
                }
                stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Bool;
                // if statements need to check their blocks with the bool type and turn it to the bool type after
            }
            else if (item.type === _parse_js__WEBPACK_IMPORTED_MODULE_1__.StatementType.If) {
                const firstBlock = traverseCheckProgram(item.block, otherIdentifiers, _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Bool, functions);
                if (item.else) {
                    const secondBlock = traverseCheckProgram(item.block, otherIdentifiers, _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Bool, functions);
                    if (secondBlock.length > 0 || firstBlock.length > 0) {
                        errors = [...errors, ...secondBlock, ...firstBlock];
                    }
                }
                else {
                    if (firstBlock.length > 0) {
                        errors = [...errors, ...firstBlock];
                    }
                }
                stack = _stack_js__WEBPACK_IMPORTED_MODULE_2__.StackType.Bool;
            }
        }
    }
    return errors;
}


/***/ }),
/* 10 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "functionToText": () => (/* binding */ functionToText),
/* harmony export */   "standardLibraryFunctions": () => (/* binding */ standardLibraryFunctions)
/* harmony export */ });
/* harmony import */ var _stack_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var readline__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);


function functionToText(name, stack, func) {
    const parameters = Object.keys(func.params).map((e) => `${e}: ${func.params[e]}`);
    return `${name}(${parameters.join(" ")}) @${stack}`;
}
const standardLibraryFunctions = {
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int]: {
        // comparison functions
        "<": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left < params.right);
            },
        },
        ">": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left > params.right);
            },
        },
        "<=": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left <= params.right);
            },
        },
        ">=": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left >= params.right);
            },
        },
        // math functions
        "+": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.left + params.right);
            },
        },
        "-": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.left - params.right);
            },
        },
        "*": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.left * params.right);
            },
        },
        "/": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                if (params.right === 0) {
                    return new Error("divide by zero. `/(right: int, left: int)` must have `right` parameter not equal to `0`");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(params.left / params.right);
            },
        },
        "//": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                if (params.right === 0) {
                    return new Error("divide by zero. `//(right: int, left: int)` must have `right` parameter not equal to `0`");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(Math.floor(params.left / params.right));
            },
        },
        "%": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                if (params.right === 0) {
                    return new Error("divide by zero. `%(right: int, left: int)` must have `right` parameter not equal to `0`");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.left % params.right);
            },
        },
        "^": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.left ^ params.right);
            },
        },
        rand: {
            params: { max: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int, min: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(Math.floor(Math.random() * (params.max - params.min + 1)) + params.min);
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float]: {
        // comparison functions
        "<": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left < params.right);
            },
        },
        ">": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left > params.right);
            },
        },
        "<=": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left <= params.right);
            },
        },
        ">=": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left >= params.right);
            },
        },
        // math functions
        "+": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(params.left + params.right);
            },
        },
        "-": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(params.left - params.right);
            },
        },
        "*": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(params.left * params.right);
            },
        },
        "/": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                if (params.right === 0) {
                    return new Error("divide by zero. `/(right: float, left: float)` must have `right` parameter not equal to `0.0`");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(params.left / params.right);
            },
        },
        "//": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                if (params.right === 0) {
                    return new Error("divide by zero. `//(right: float, left: float)` must have `right` parameter not equal to `0.0`");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(Math.floor(params.left * params.right));
            },
        },
        "%": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                if (params.right === 0) {
                    return new Error("divide by zero. `%(right: float, left: float)` must have `right` parameter not equal to `0.0`");
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.left % params.right);
            },
        },
        "^": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(params.left ^ params.right);
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str]: {
        length: {
            params: { string: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(params.str.length);
            },
        },
        "+": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.left + params.right);
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool]: {
        // comparison functions
        "&": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left && params.right);
            },
        },
        "|": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left || params.right);
            },
        },
        "!": {
            params: { boolean: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(!params.boolean);
            },
        },
    },
    [_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any]: {
        // Word functions
        dup: {
            params: { first: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params, stack) => {
                stacks[stack].push(params.first);
                stacks[stack].push(params.first);
            },
        },
        drop: {
            params: { first: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
        },
        swap: {
            params: { first: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any, second: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params, stack) => {
                stacks[stack].push(params.first);
                stacks[stack].push(params.second);
            },
        },
        over: {
            params: { first: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any, second: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params, stack) => {
                stacks[stack].push(params.second);
                stacks[stack].push(params.first);
                stacks[stack].push(params.second);
            },
        },
        rot: {
            params: {
                first: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any,
                second: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any,
                third: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any,
            },
            rawCode: (stacks, params, stack) => {
                stacks[stack].push(params.second);
                stacks[stack].push(params.first);
                stacks[stack].push(params.third);
            },
        },
        print: {
            params: { item: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params, stack, consoleFunc) => {
                if (stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float &&
                    !params.item.toString().includes(".")) {
                    params.item = params.item.toFixed(1);
                }
                consoleFunc(params.item.toString());
                stacks[stack].push(params.item);
            },
        },
        read: {
            params: { prompt: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str },
            rawCode: async (stacks, params, stack) => {
                // does not work on browser
                if (window !== undefined) {
                    return;
                }
                const rl = readline__WEBPACK_IMPORTED_MODULE_1__.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                const answer = await new Promise((resolve) => {
                    rl.question(params.prompt, resolve);
                });
                rl.close();
                if (stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str) {
                    stacks[stack].push(answer);
                }
                else if (stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool) {
                    if (answer.trim() === "true") {
                        stacks[stack].push(true);
                    }
                    else if (answer.trim() === "false") {
                        stacks[stack].push(false);
                    }
                    else {
                        return new Error(`invalid input for type \`${stack}\`: \`${answer}\``);
                    }
                }
                else {
                    // int or float
                    const isFloat = stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float;
                    let isInDecimal = false;
                    for (const char of answer.trim().split("")) {
                        if (char === ".") {
                            if (isInDecimal || !isFloat) {
                                return new Error(`invalid input for type \`${stack}\`: \`${answer}\``);
                            }
                            else {
                                isInDecimal = true;
                                continue;
                            }
                        }
                        if (!(char >= "0" && char <= "9")) {
                            return new Error(`invalid input for type \`${stack}\`: \`${answer}\``);
                        }
                    }
                    if (isFloat) {
                        stacks[stack].push(parseFloat(answer));
                    }
                    else {
                        stacks[stack].push(parseInt(answer));
                    }
                }
            },
        },
        // comparison functions
        "==": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left === params.right);
            },
        },
        "!=": {
            params: { right: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any, left: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(params.left !== params.right);
            },
        },
        // conversion functions
        toStr: {
            params: { item: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params, stack) => {
                if (stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float &&
                    !params.item.toString().includes(".")) {
                    params.item = params.item.toFixed(1);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Str].push(params.item.toString());
            },
        },
        toBool: {
            params: { item: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params) => {
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool].push(!!params.item);
            },
        },
        toInt: {
            params: { item: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params, stack) => {
                let int;
                if (stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int) {
                    int = params.item;
                }
                else if (stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float) {
                    int = Math.trunc(params.item);
                }
                else if (stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool) {
                    int = params.item ? 1 : 0;
                }
                else {
                    for (const char of params.item.split("")) {
                        if (!(char >= "0" && char <= "9")) {
                            return new Error(`unable to convert \`str\` to \`int\`: \`${params.item}\``);
                        }
                    }
                    int = parseInt(params.item);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int].push(int);
            },
        },
        toFloat: {
            params: { item: _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Any },
            rawCode: (stacks, params, stack) => {
                let float;
                if (stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float || stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Int) {
                    float = params.item;
                }
                else if (stack === _stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Bool) {
                    float = params.item ? 1 : 0;
                }
                else {
                    let isInDecimal = false;
                    for (const char of params.item.split("")) {
                        if (char === ".") {
                            if (isInDecimal) {
                                return new Error(`unable to convert \`str\` to \`float\`: \`${params.item}\``);
                            }
                            else {
                                isInDecimal = true;
                                continue;
                            }
                        }
                        if (!(char >= "0" && char <= "9")) {
                            return new Error(`unable to convert \`str\` to \`float\`: \`${params.item}\``);
                        }
                    }
                    float = parseFloat(params.item);
                }
                stacks[_stack_js__WEBPACK_IMPORTED_MODULE_0__.StackType.Float].push(float);
            },
        },
    },
};


/***/ }),
/* 11 */
/***/ ((module) => {

"use strict";
module.exports = require("readline");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".extension.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = void 0;
const vscode = __webpack_require__(1);
const diagnostics_1 = __webpack_require__(2);
function activate(context) {
    const parseAndTypeErrors = vscode.languages.createDiagnosticCollection("parseAndTypeErrors");
    context.subscriptions.push(parseAndTypeErrors);
    (0, diagnostics_1.subscribeToDocumentChanges)(context, parseAndTypeErrors);
}
exports.activate = activate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map