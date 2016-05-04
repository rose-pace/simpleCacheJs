var simpleCache = require('./simpleCache'),
    assert = require('assert'),
    key = 'myKey',
    factoryExecuteCount = 0;

// key: myKey
// factory: function
// ttl: 300 seconds
var data = simpleCache.ensure(key, function () {
    factoryExecuteCount++;
    var d = []; for (var i = 0; i < 100; i++) { d.push(i); } return d;
}, 300);

assert.equal(data.length, 100);
assert.equal(factoryExecuteCount, 1);

data = simpleCache.ensure(key, function () { factoryExecuteCount++; return [0,1,2]; }, 300); 

assert.equal(data.length, 100);
assert.equal(factoryExecuteCount, 1);

simpleCache.remove(key);
data = simpleCache.get(key);

assert(!data);

simpleCache.set(key, true, 1);
data = simpleCache.get(key);
assert.equal(data, 1);

setTimeout(function() {
    data = simpleCache.ensure(key, function () { factoryExecuteCount++; return 5; }, 300);
    assert.equal(data, 5);
    assert.equal(factoryExecuteCount, 2);
    //teardown
    simpleCache.removeAll();
    console.log("all tests passed!!");
}, 1001);