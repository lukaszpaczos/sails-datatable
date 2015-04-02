![image_squidhome@2x.png](http://i.imgur.com/RIvu9.png)

# sails-datatable

This module is a Waterline/Sails adapter to use with jQuery datatable (tested on 1.10.4). 
I implement only basic things.

### Installation

To install this adapter, run:

```sh
$ npm install sails-datatable
```

### Usage

This adapter exposes the following methods:

###### `datatable(params)`

+ params variable is datatable params

### Example of use

After you install follow these steps:

1.Open `config/adapters.js` and put there:
```javascript
'sails-datatable': require('sails-datatable');
```
2.Open `config/connections.js` and add:
```javascript
    datatable: {
        adapter: 'sails-datatable'
    },
```
3.Open model file and add connection:
```javascript
connection: 'datatable',
```
4.In controller add datatable action (example below):
```javascript
datatable: {
	action: function (req, res, next) {
		Model.datatable(req.body, function (err, data) {
			if (err) {
				return next(new error.InvalidContentError(err));
			} else {
				res.send(data);
				next();
			}
		});
	}
}
```
5.Populate in datatable:
```javascript
datatable: {
	action: function (req, res, next) {
		req.body.populate = ['item1', 'item2', 'item3'];
		Model.datatable(req.body, function (err, data) {
			if (err) {
				return next(new error.InvalidContentError(err));
			} else {
				res.send(data);
				next();
			}
		});
	}
}
```
6.GroupBy in datatable:
```javascript
datatable: {
	action: function (req, res, next) {
		req.body.groupBy = ['item1', 'item2', 'item3'];
		req.body.sumBy = 'item1'; // Waterline groupBy works only when have aggregation function
		Model.datatable(req.body, function (err, data) {
			if (err) {
				return next(new error.InvalidContentError(err));
			} else {
				res.send(data);
				next();
			}
		});
	}
}
```
### License

**[MIT](./LICENSE)**
&copy; 2014 [lukaszpaczos](http://github.com/lukaszpaczos)

[Sails](http://sailsjs.org) is free and open-source under the [MIT License](http://sails.mit-license.org/).


[![githalytics.com alpha](https://cruel-carlota.pagodabox.com/8acf2fc2ca0aca8a3018e355ad776ed7 "githalytics.com")](http://githalytics.com/balderdashy/waterline-datatable/README.md)


