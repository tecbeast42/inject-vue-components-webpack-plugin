const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

module.exports = function(source) {
    return inject(source, getConfig(this), this.context);
};

function getConfig (space) {
    return Object.assign(
        {
            path: 'resources/assets/vue',
            separator: '-',
            injectComment: /(\/\/\s*{{\s*inject-vue-components\s*}}\n?)/ig,
            exclude: [],
            type: 'require',
        },
        loaderUtils.getOptions(space)
    );
}

function inject (source, config, context) {
    const injectionPoints = getInjectionPoints(source, config.injectComment);

    // Only get and replace if there is an injection point
    if (injectionPoints.length > 0) {
        const injectString = getInjectString(config, context);

        injectionPoints.forEach(function (point) {
            source = source.replace(point[1], injectString);
        });
    }

    return source;
}

function getInjectString (config, context) {
    var files = fs.readdirSync(config.path);
    var components = [];
    var currentFolder = config.path;

    // Traverse all folders and files to get the components
    files.forEach(traverse);

    function traverse(filePath, index) {
        var folderAbove = currentFolder;
        var currentPath = path.join(currentFolder, filePath);
        var file = fs.statSync(currentPath);
        var relativePath = path.relative(config.path, currentPath);

        // Loop all the paths to exclude and see if we should skip the current one
        for (let excludePath of config.exclude) {
            if (excludePath === relativePath) {
                return;
            }
        }

        if (file.isFile()) {
            // Get the component name and path if its a file
            var componentName = relativePath;
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
        if (config.type === 'import') {
            injectString += "import vuecomp" + index + " from '" + component.path + "'; \nVue.component('" + component.name + "', vuecomp" + index + ");\n";
        } else {
            injectString += "Vue.component('" + component.name + "', require('" + component.path +"'));\n";
        }
    });

    return injectString;
}

function getInjectionPoints (data, regexp) {
    if (typeof regexp === 'string') {
        regexp = new RegExp("(\\/\\/\\s*" + regexp + "\\n?)", "ig");
    }

    var injectionPoints = [];
    data.replace(regexp, function () {
        var arr = Array.prototype.slice.call(arguments);
        injectionPoints.push(arr);
    });
    return injectionPoints;
}
