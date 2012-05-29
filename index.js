var fs = require('fs');
var {merge} = require('ringo/utils/objects');

var jar = module.resolve('./jars/commons-csv-1.0-20120330.022036-106.jar');
addToClasspath(jar);

exports.parse = function(path, options) {
    options = merge(options || {}, {
        format: 'DEFAULT',
        headers: true,
        blank: '',
        gzip: false
    });

    var reader;
    if (path) {
        if (options.gzip) {
            var bis = new java.io.BufferedInputStream(new java.io.FileInputStream(path));
            var gis = new java.util.zip.GZIPInputStream(bis);
            reader = new java.io.InputStreamReader(gis);
        }
        else reader = new java.io.FileReader(path);
    }
    else reader = new java.io.InputStreamReader(java.lang.System.in);

    var format = org.apache.commons.csv.CSVFormat[options.format];
    var parser = new org.apache.commons.csv.CSVParser(reader, format);
    var iterator = parser.iterator();

    function row() {
        var fields = [];
        var record = iterator.next().iterator();
        while (record.hasNext()) {
            var value = record.next();
            if (value === '') value = options.blank;
            fields.push(value);
        }
        return fields;
    }

    var headers = [];
    if (Array.isArray(options.headers)) headers = options.headers;
    else if (options.headers) headers = row().map(function(value) value.trim())

    while (iterator.hasNext()) {
        var fields = row();

        headers.forEach(function(header, index) {
            if (header) fields[header] = fields[index];
        });

        yield(fields);
    }

    yield(null);
}
