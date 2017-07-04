const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');
const regex = /(\/\/\s*inject-vue-components\n?)/ig;

module.exports = function(source) {
    return inject(source, getConfig(this), this.context);
};

function getConfig (space) {
    return Object.assign(
        {
            folder: 'resources/assets/vue',
            separator: '-'
        },
        loaderUtils.getOptions(space)
    );
}

function inject (source, config, context) {
    const injectString = getInjectString(config, context);

    const injectionPoints = getInjectionPoints(source, regex);
    injectionPoints.forEach(function (point) {
        source = source.replace(point[1], injectString);
    });

    return source;
}

function getInjectString (config, context) {
    var files = fs.readdirSync(config.folder);
    var components = [];
    var currentFolder = config.folder;
    // Traverse all folders and files to get the components
    files.forEach(traverse);

    function traverse(filePath, index) {
        var folderAbove = currentFolder;
        var currentPath = path.join(currentFolder, filePath);
        var file = fs.statSync(currentPath);

        if (file.isFile()) {
            // Get the component name and path if its a file
            var length = config.folder.length;
            if (!config.folder.endsWith('/')) {
                length++;
            }
            var componentName = currentPath.substr(length);
            componentName = componentName.replace(/\//g, config.separator);
            componentName = componentName.replace('.vue', '');
            components.push({ name: componentName, path: path.relative(context, currentPath) });
        } else if (file.isDirectory()) {
            // Traverse deeper if its a directory
            var dirFiles = fs.readdirSync(currentPath);
            currentFolder = currentPath;
            dirFiles.forEach(traverse);
            // Reset to the folder above (so we can traverse other files/folders there)
            currentFolder = folderAbove;
        }
    }

    var injectString = '';
    components.forEach(function (component, index) {
        injectString += "Vue.component('" + component.name + "', require('" + component.path +"'));\n";
    });

    return injectString;
}

function getInjectionPoints (data, regexp) {
    var injectionPoints = [];
    data.replace(regexp, function () {
        var arr = Array.prototype.slice.call(arguments);
        injectionPoints.push(arr);
    });
    return injectionPoints;
}
