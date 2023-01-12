import {
  standardLibraryFunctions,
  type StackFunctions,
} from "typestack-lang/dist/functions";

let builtIns: string[] = [];
Object.keys(standardLibraryFunctions).forEach(
  (type) =>
    (builtIns = [
      ...builtIns,
      ...Object.keys(standardLibraryFunctions[type as keyof StackFunctions]),
    ])
);
builtIns = [...new Set(builtIns)];

export default class Highlight {
  input: string;
  html: string;
  pointer: number;

  constructor(input: string) {
    this.input = input;
    this.html = "";
    this.pointer = 0;
  }

  run(): string {
    while (!this.#isAtEnd()) {
      const current = this.#peek();

      if (["(", ")", "{", "}", ":"].includes(current)) {
        this.#addSpan(current, "punctuation");
        this.#increment();
        continue;
      }

      if ("#" === current) {
        let str = "";
        while (!this.#isAtEnd() && this.#peek() !== "\n") {
          str += this.#peek();
          this.#increment();
        }
        this.#addSpan(str, "comment");
        continue;
      }

      if (current === " ") {
        this.#increment();
        this.html += "&nbsp;";
        continue;
      }

      if ("\n" === current) {
        this.#increment();
        this.html += "<br/>";
        continue;
      }

      if ('"' === current) {
        this.#increment();
        let str = '"';

        while (!this.#isAtEnd() && this.#peek() !== '"') {
          if (this.#peek() === "\\") {
            str += "\\";
            this.#increment();
          }

          if (this.#peek() === "\n") {
            this.#addSpan(str, "str");
            this.html += "<br/>";
            str = "";
          } else {
            str += this.#peek();
          }
          this.#increment();
        }

        if (this.#isAtEnd()) {
          this.#addSpan(str, "str");
        } else {
          this.#increment();
          this.#addSpan(str + '"', "str");
        }
        continue;
      }

      if (current >= "0" && current <= "9") {
        this.#number();
      } else {
        this.#identifier();
      }
    }
    return this.html;
  }

  #addSpan(string: string, className: string) {
    this.html += `<span class="token-${className}">${this.#escapeHtml(
      string
    )}</span>`;
  }
  #escapeHtml(string: string) {
    return string
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  #isAtEnd(): boolean {
    return this.pointer >= this.input.length;
  }
  #peek(): string {
    return this.input[this.pointer];
  }
  #increment() {
    this.pointer += 1;
  }

  #number() {
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
    }
    this.#addSpan(strOfNumber, "number");
  }

  #identifier() {
    let str = "";

    while (
      !this.#isAtEnd() &&
      ![" ", "\n", "\t", "\r", ":", "{", "}", "(", ")", "#", '"'].includes(
        this.#peek()
      )
    ) {
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

    if (str === "false" || str === "true") {
      this.#addSpan(str, "bool");
    } else if (keywords.includes(str)) {
      this.#addSpan(str, "keyword");
    } else if (builtIns.includes(str)) {
      this.#addSpan(str, "builtin");
    } else {
      this.#addSpan(str, "identifier");
    }
  }
}
