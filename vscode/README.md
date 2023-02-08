# TypeStack

Syntax highlighting, error showing and code completion for the TypeStack language.

## Features

### Syntax Highlighting

* Highlights `.tsk` files

![Highlighting](vscode/images/highlight.png)

### Errors

* Reports scanning, parsing and type-checking errors in `.tsk` files

![Errors](vscode/images/error.png)

### Code Completion

* Recommends function and keywords to use

![Code Completion](vscode/images/codeCompletion.png)

### Code Running

* Saves and runs the current file in the integrated terminal

![Code Running](vscode/images/runCode.png)

## Requirements

To use the play button you will need to install TypeStack. 

```bash
npm install typestack-lang -g
```


## Known Issues

Errors that occur on the `EOF` token will cause error squiggles to be found on the last piece of text instead of after the end of the file.

## Release Notes


### 1.0.0

Initial release of typestack