# Contributing

- [Contributing](#contributing)
  - [Markdown Documents](#markdown-documents)
  - [Coding Rules](#coding-rules)
    - [ESLint](#eslint)
  - [Commit Guideline](#commit-guideline)
    - [Commit Message Format](#commit-message-format)

## Markdown Documents

Markdown documents should respect the [Markdownlint rules](#https://github.com/DavidAnson/markdownlint/blob/v0.11.0/doc/Rules.md) with a special exception for [**MD033**](https://github.com/DavidAnson/markdownlint/blob/v0.11.0/doc/Rules.md#md033---inline-html): Some HTML tags can be used, such as `<center>`, `<dl>`, `<dd>`, `<dt>` or special tags (`<div>`, `<h1>`) to use a [custom anchor id](https://stackoverflow.com/a/48453745/8110666)

For documents with a TOC (**Table of Contents**), don't forget to put in comment `<!-- omit in toc -->` for omited titles in the Table of Contents

## Coding Rules

- We're extending the [JS Standard Code Style](https://standardjs.com/rules.html) with the following changes:
  - **Use 4 spaces** for indentation
  
    eslint: [indent](https://eslint.org/docs/rules/indent)

    ```js
    function hello (name) {
        console.log('hi', name)
    }
    ```

  - **Use semicolons**

    eslint: [semi](https://eslint.org/docs/rules/semi)

    ```js
    window.alert('hi');  // ✓ ok
    window.alert('hi')   // ✗ avoid
    ```

  - **Use the allman style** for braces

    eslint: [brace-style](https://eslint.org/docs/rules/brace-style#allman)

    ```js
    // ✓ ok
    if (condition)
    {
        // ...
    }
    else
    {
        // ...
    }
    ```

    ```js
    // ✗ avoid
    if (condition) {
        // ...
    } else {
        // ...
    }
    ```

  - **The \* in yield\* expression must have a space after**

    eslint: [yield-star-spacing](https://eslint.org/docs/rules/yield-star-spacing)

    ```js
    yield* increment();    // ✓ ok
    yield * increment();   // ✗ avoid
    ```

  - **The \* in generator\* expression must have a space after**

    eslint: [generator-star-spacing](https://eslint.org/docs/rules/generator-star-spacing)

    ```js
    function* generator();  // ✓ ok
    function * generator(); // ✗ avoid
    ```

### ESLint

ESLint is configured to lint and fix the code following those rules, just run :

```bash
npm run lint
```

## Commit Guideline

The following conventions aims to have **more readable messages** that are easy to follow when looking through the **project history** and also manage automated issues and project cards

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type <!-- omit in toc -->

- **build**: Changes that affect the build system or external dependencies (webpack, npm)
- **docs**: Documentation changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding tests or correcting existing tests

#### Subject <!-- omit in toc -->

A short description of the changes:

- use the imperative, present tense: "changed" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

#### Scope <!-- omit in toc -->

As the `scope` is linked the project architeture, this part should be updated. If there is no scope corresponding to your changes, add one.

Here are the current scopes:

| Scope      | Description (if useful) |
| ---------- | ----------------------- |
| (no scope) | Global changes          |
| `commit`   | <center>-</center>      |
| `hi` | <center>-</center> |
| `eslint`   | <center>-</center>      |

#### Body <!-- omit in toc -->

Just as the **subject**, use imperative, present tense. The body should include the motivation
for the changes and the differences with the previous behavior

#### Footer <!-- omit in toc -->

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit [**Closes**](https://help.github.com/articles/closing-issues-using-keywords/)

**Breaking Changes** should start with the word `BREAKING CHANGE`: with a space or two newlines. The rest of the commit message is then used for this