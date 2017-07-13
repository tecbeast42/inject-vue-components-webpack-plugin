[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/vue-components-autodetect-webpack.svg)](https://www.npmjs.com/package/vue-components-autodetect-webpack)
[![npm](https://img.shields.io/npm/dt/vue-components-autodetect-webpack.svg)](https://www.npmjs.com/package/vue-components-autodetect-webpack)


# Vue components autodetect Webpack loader

Inject Vue components into your webpack bundle based on folder structure and filename. So you save a file to edit for every new component.

```
index.vue -> <index></index>
page/index.vue -> <page-index></page-index>
post/button/delete.vue -> <post-button-delete></post-button-delete>
folder/folder/file.vue -> <folder-folder-file></folder-folder-file>
```

## Usage

### In your JS file

this comment gets expanded into Vue Component list
```
// {{ inject-vue-components }}
```

so it will look like this
```
Vue.component('folder-file', require('folder/file.vue'));
```
### Configuration

|Name|Type|Description|Default|
|:--:|:--:|:----------|:----------|
|**`path`**|`{String}`|The path to the folder where your vue components are|'resources/assets/vue'|
|**`separator`**|`{String}`|The separator in the Vue component name|'-'|
|**`injectComment`**|`{StringǀRegex}`|The comment where the components will be injected (string adds // before)|/(\/\/\s*{{\s*inject-vue-components\s*}}\n?)/ig|
|**`exclude`**|`{Array}`|An array of paths/files to exclude, using path as base|[]|

### In Webpack

```
module: {
    rules: [
        {
            test: /\.js$/,
            use: [
                {
                    loader: 'vue-components-autodetect-webpack',
                    options: {
                        path: 'resources/assets/vue',
                        separator: '-',
                        injectComment: /(\/\/\s*{{\s*inject-vue-components\s*}}\n?)/ig,
                        exclude: ['page']
                    }
                },
                // ... other loaders
            ]
        },
    ]
}
```

## Installation

```
npm install --save vue-components-autodetect-webpack
yarn add vue-components-autodetect-webpack
```

