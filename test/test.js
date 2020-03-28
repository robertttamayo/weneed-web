var chai = require("chai");
var History = require("../src/util/filteritemhistory");
var filterItemHistory = History.filterItemHistory;

describe('Array', function(){
    describe('#history filters properly', function(){

        var item_history = [
            {"item_name":"Bacon","item_is_purchased":"0","item_date":"2020-02-26","item_status":"green"},
            {"item_name":"Eggs","item_is_purchased":"0","item_date":"2020-02-26","item_status":"green"},
            {"item_name":"Waffles","item_is_purchased":"1","item_date":"2020-02-23","item_status":"blue"},
            {"item_name":"Bananas","item_is_purchased":"0","item_date":"2020-02-23","item_status":"green"},
            {"item_name":"Bacon","item_is_purchased":"1","item_date":"2020-02-23","item_status":"blue"},
            {"item_name":"Waffles","item_is_purchased":"1","item_date":"2020-02-10","item_status":"blue"},
            {"item_name":"Bananas","item_is_purchased":"1","item_date":"2020-02-10","item_status":"blue"},
            {"item_name":"Bananas","item_is_purchased":"0","item_date":"2020-02-10","item_status":"green"},
            {"item_name":"Eggs","item_is_purchased":"1","item_date":"2020-02-06","item_status":"blue"},
            {"item_name":"Pancakes","item_is_purchased":"1","item_date":"2020-02-06","item_status":"blue"},
        ];

        it('should have 2 items with name "bananas" that are not purchased', function(){
            var searchTerm = 'bananas';
            var itemFilter = 'added';
            
            var expected = [
                {"item_name":"Bananas","item_is_purchased":"0","item_date":"2020-02-23","item_status":"green"},
                {"item_name":"Bananas","item_is_purchased":"0","item_date":"2020-02-10","item_status":"green"},
            ];
            var actual = filterItemHistory(item_history, searchTerm, itemFilter);
            chai.expect(expected).to.eql(actual);
        });

        it('should have 1 item with name "bananas" that is purchased', function(){
            var searchTerm = 'bananas';
            var itemFilter = 'purchased';
            var expected = [
                {"item_name":"Bananas","item_is_purchased":"1","item_date":"2020-02-10","item_status":"blue"},
            ];
            var actual = filterItemHistory(item_history, searchTerm, itemFilter);
            chai.expect(expected).to.eql(actual);
        });

        it('should have 3 items with name "bananas" that are either purchased or not purchased', function(){
            var searchTerm = 'bananas';
            var itemFilter = 'all';
            var expected = [
                {"item_name":"Bananas","item_is_purchased":"0","item_date":"2020-02-23","item_status":"green"},
                {"item_name":"Bananas","item_is_purchased":"1","item_date":"2020-02-10","item_status":"blue"},
                {"item_name":"Bananas","item_is_purchased":"0","item_date":"2020-02-10","item_status":"green"},
            ];
            var actual = filterItemHistory(item_history, searchTerm, itemFilter);
            chai.expect(expected).to.eql(actual);
        });
    });
  });