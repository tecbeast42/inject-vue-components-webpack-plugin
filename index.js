const fs = require('fs');
const path = require('path');
const regex = /(\/\/\s*start-inject-vue-components)\n([\s\S]*?\n?)(\/\/\s*end-inject-vue-components)/ig;

module.exports = class InjectVueComponentsPlugin {
    constructor(config) {
        this.config = Object.assign(
            {
                folder: 'resources/assets/vue',
                entry: 'resources/assets/js/app.js',
                separator: '-'
            },
            config
        );
    }

    apply(compiler) {
        const context = compiler.options.context;
        const entry = path.join(context, this.config.entry);
        const injectString = this.getInjectString(context, this.config.folder);

        var data = fs.readFileSync(entry, 'utf8');
        const injectionPoints = this.getInjectionPoints(data, regex);
        injectionPoints.forEach(function (point) {
            data = data.replace(point[2], injectString);
        });

        fs.writeFileSync(entry, data);
    }

    getInjectString(context, folder) {
        var self = this;
        var files = fs.readdirSync(folder);
        var components = [];
        var currentFolder = folder;
        // Traverse all folders and files to get the components
        files.forEach(traverse);

        function traverse(filePath, index) {
            var folderAbove = currentFolder;
            var currentPath = path.join(currentFolder, filePath);
            var file = fs.statSync(currentPath);

            if (file.isFile()) {
                // Get the component name and path if its a file
                var length = folder.length;
                if (!folder.endsWith('/')) {
                    length++;
                }
                var componentName = currentPath.substr(length);
                componentName = componentName.replace(/\//g, self.config.separator);
                componentName = componentName.replace('.vue', '');
                components.push({ name: componentName, path: path.join(context, currentPath) });
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

    getInjectionPoints(data, regexp) {
        var injectionPoints = [];
        data.replace(regexp, function () {
            var arr = Array.prototype.slice.call(arguments);
            injectionPoints.push(arr);
        });
        return injectionPoints;
    }
}
