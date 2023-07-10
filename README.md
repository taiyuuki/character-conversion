## Character Conversion

A custom decorator that convert characters in the code to other characters you like.

Languages:  `html` `javascript` `typescript` `react` `vue` `svelte`

## Settings

| Available Settings             | Character      | Default Conversion |
| ------------------------------ | -------------- | ------------------ |
| `characterConversion.arrow`    | `=>`           | `⇒`                |
| `characterConversion.equal`    | `===` and `==` | `＝`               |
| `characterConversion.notequal` | `!==` and `!=` | `≠`                |
| `characterConversion.notless`  | `>=`           | `≧`                |
| `characterConversion.notmore`  | `<=`           | `≦`                |
| `characterConversion.rules`    | `any`          | `any`              |

If you don't want to convert a certain character, you can leave it blank.

You can convert any characters by yourself via `characterConversion.rules`. For Example:

Convert the `->` mark to `➝`

`settings.json`

```json
{
    "characterConversion.rules": [
        ["->", "➝"],
    ]
}
```

The format of each item is [`origin`, `target`, `group`] 

* `origin` - string - Regex in string format.

* `target` - string - Target characters for conversion.
* `group` - number - Regex group that match the characters  that should be converted, default is 0.