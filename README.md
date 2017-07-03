[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/inject-vue-components-webpack-plugin.svg)](https://www.npmjs.com/package/inject-vue-components-webpack-plugin)
[![npm](https://img.shields.io/npm/dt/inject-vue-components-webpack-plugin.svg)](https://www.npmjs.com/package/inject-vue-components-webpack-plugin)


# Inject Vue components Webpack plugin

Inject Vue components to js file based on folder structure.

```
index.vue -> <index></index>
page/index.vue -> <page-index></page-index>
post/button/delete.vue -> <post-button-delete></post-button-delete>
folder/folder/file.vue -> <folder-folder-file></folder-folder-file>
```

## Installation

```
npm install --save inject-vue-components-webpack-plugin
yarn add inject-vue-components-webpack-plugin
```

## Usage

### Configuration

|Name|Type|Description|
|:--:|:--:|:----------|
|**`folder`**|`{String}`|The folder where your vue components are|
|**`entry`**|`{String}`|The js file where the components should be injected|
|**`separator`**|`{String}`|The separator in the Vue component name|

### In Webpack

```
var InjectVueComponentsPlugin = require('inject-vue-components-webpack-plugin');

...

plugins: [
    new InjectVueComponentsPlugin({
            folder: 'resources/assets/vue',
            entry: 'resources/assets/js/app.js',
            separator: '-',
        }
    ),
],
```

### In the JS file

In Code:
```
// start-inject-vue-components
//
// end-inject-vue-components
```
> :warning: Do not forget atleast one line between start and end (can be anything, just not empty).

gets transformed to

```
// start-inject-vue-components
Vue.component('folder-file', require('folder/file.vue'));
// end-inject-vue-components
```
