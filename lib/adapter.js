'use strict';

var Errors = require('waterline-errors').adapter;

module.exports = (function () {
    var connections = {};
    var adapter = {
        identity: 'sails-datatable',
        syncable: false,

        registerConnection: function(connection, collections, cb) {
            if(!connection.identity) return cb(Errors.IdentityMissing);
            if(connections[connection.identity]) return cb(Errors.IdentityDuplicate);

            connections[connection.identity] = connection;
            cb();
        },
        teardown: function (conn, cb) {
            if (typeof conn == 'function') {
                cb = conn;
                conn = null;
            }
            if (!conn) {
                connections = {};
                return cb();
            }

            if(!connections[conn]) return cb();
            delete connections[conn];
            cb();
        },
        describe: function (connection, collection, cb) {
            return cb();
        },
        define: function (connection, collection, definition, cb) {
            return cb();
        },
        drop: function (connection, collection, relations, cb) {
            return cb();
        },
        datatable: function (connection, collection, options, cb) {
            if (!options.start) {
                options.start = 0;
            }

            if (!options.length) {
                options.length = 10;
            }

            var recordsTotal = 0;
            var recordsFiltered = 0;

            this.count().exec(function (err, num) {
                recordsTotal = num;
                recordsFiltered = num;
            });

            var findQuery = this.find().skip(options.start).limit(options.length);

            if (options.order) {
                for (var i in options.order) {
                    var orderObj = options.order[i];

                    findQuery.sort(options.columns[orderObj.column].data + ' ' + orderObj.dir);
                }
            }

            if (options.search && options.search.value) {
                var whereObj = {
                    or: []
                };

                for (var i in options.columns) {
                    var columnObj = options.columns[i];
                    var columnWhereObj = {};

                    columnWhereObj[options.columns[i].data] = {
                        like: '%' + options.search.value + '%'
                    };

                    whereObj.or.push(columnWhereObj);
                }

                findQuery.where(whereObj);
            }

            findQuery.exec(function (err, data) {
                if (err) {
                    return cb(err);
                } else {
                    if (options.search.value) {
                        recordsFiltered = data.length;
                    }

                    return cb (null, {
                        draw: options.draw,
                        recordsTotal: recordsTotal,
                        recordsFiltered: recordsFiltered,
                        data: data
                    });
                }
            });
        }
    };

    return adapter;
})();

