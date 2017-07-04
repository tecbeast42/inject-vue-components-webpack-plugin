[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/v/vue-components-autodetect-webpack.svg)](https://www.npmjs.com/package/vue-components-autodetect-webpack)
[![npm](https://img.shields.io/npm/dt/vue-components-autodetect-webpack.svg)](https://www.npmjs.com/package/vue-components-autodetect-webpack)


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
npm install --save vue-components-autodetect-webpack
yarn add vue-components-autodetect-webpack
```

## Usage

### Configuration

|Name|Type|Description|
|:--:|:--:|:----------|
|**`folder`**|`{String}`|The folder where your vue components are|
|**`separator`**|`{String}`|The separator in the Vue component name|

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
                        folder: 'resources/assets/vue',
                        separator: '-',
                    }
                },
                // ... other loaders
            ]
        },
    ]
}
```

### In the JS file

In the entry file:
```
// inject-vue-components
```

gets transformed to

```
Vue.component('folder-file', require('folder/file.vue'));
```
