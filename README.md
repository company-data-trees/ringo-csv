# ringo-csv

A CSV parser for [RingoJS](http://ringojs.org/) based on [Apache Commons CSV](http://commons.apache.org/csv/).

## Examples

The parse function returns an iterator (which yields rows then null as a final result).

    for (var row in csv.parse()) { … }

If no file is specified (or null, undefined, blank, etc), the parser reads from stdin.

But, assuming this is the input (in 'qaz.csv'):

    id,name
    0,foo
    1,bar
    2,

By default, the parser assumes the first row is the column headers, which can be used to reference values in subsequent data rows. Data row values can also be accessed as standard arrays. 

    for (var row in csv.parse('./qaz.csv')) {
        if (row === null) break;
        row[0] == row.id;
        row[1] == row.name;
    }

If there is not a header row, use:

    csv.parse(file, { headers: false })

For tab-delimited files:

    csv.parse(file, { format: 'TDF' })

You can also control how blank values are handled (default is ''):

    for (var row in csv.parse(null, { blank: undefined })) {
        row.id == 2 && row.name == undefined;
    }


## License

This module is under the MIT license, and the included CSV jar is under Apache License v2.
