# QuillMermaid

A Quill.js module to add Mermaid support. Help you to write flowcharts, sequence diagrams, gantt charts and more.

If you are familiar with Markdown you should have no problem learning [Mermaid's Syntax](https://mermaid.js.org/intro/syntax-reference.html).

[Demo](https://quill-modules.github.io/quill-mermaid-chart/)

## Usage

Makesure mermaid is loaded on window

```js
import QuillMermaid from 'quill-mermaid';
import 'quill-mermaid/dist/index.css';

Quill.register({
  'modules/mermaid': QuillMermaid,
}, true);

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      // ...
      // add mermaid chart button
      ['mermaid-chart'],
    ],
    mermaid: {
      selectorOptions: {
        onDestroy() {},
        onRemove(blot) {},
        onEdit(blot, isEnter) {},
      },
      histroyStackOptions: {
        maxStack: 100,
        delay: 1000
      },
    }
  },
});
```

## Options

| attribute                    | description                                                                                       | type                                    | default |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------- | ------- |
| selectorOptions.onDestroy    | trigger when selector destroy                                                                     | `() => void`                            | -       |
| selectorOptions.onRemove     | trigger when selector click remove button. if it returns `true`, the chart it will not be removed | `(blot: MermaidChartFormat) => boolean` | -       |
| selectorOptions.onEdit       | trigger when selector click edit button                                                           | `() => void`                            | -       |
| selectorOptions.template     | custom the chart template                                                                         | `Record<string, string>`                | -       |
| histroyStackOptions.maxStack | max record mermaid editor history                                                                 | `number`                                | `100`   |
| histroyStackOptions.delay    | record input value the time interval each time(ms)                                                | `number`                                | `1000`  |
