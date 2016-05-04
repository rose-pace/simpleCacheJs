/**/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.simpleCache = factory()
})(this, function () {
    var cache = {},
        timeoutRunning = false,
        CacheItem = (function () {
            function CacheItem(key, value, ttl) {
                this.key = key;
                this.value = value;
                this.ttl = ttl;
            }
            CacheItem.prototype.decrimentLife = function () {
                if (isNumber(this.ttl)) {
                    this.ttl--;
                    return this.ttl;
                }
                return 1; //alive
            };
            return CacheItem;
        })();
    
    function getCacheItem(key) {
        return cache[key];
    }
    
    function get(key) {
        var val = getCacheItem(key);
        if (isObject(val)) {
            return val.value;
        }
        return undefined;
    }
    
    function set(key, value, ttl) {
        var item = new CacheItem(key, value, ttl);
        cache[key] = item;
        
        if (!timeoutRunning) startTimeoutCheck(); //start timeout checks
        
        return item;
    }
    
    function remove(key) {
        delete cache[key];
    }
    
    function removeAt(key, seconds) {
        var val = getCacheItem(key)
        if (isObject(val)) {
            val.timeout = seconds;
        }
    }
    
    function removeAll() { cache = {}; }
    
    function ensure(key, factory, ttl) {
        var val = getCacheItem(key);
        if (!isObject(val)) {
            val = set(key, factory(), ttl);
        }
        return val.value;
    }
    
    function checkTimeout() {
        for (var key in cache) {
            if (!getCacheItem(key).decrimentLife()) {
                remove(key);
            }
        }
        startTimeoutCheck();
    }
    
    function startTimeoutCheck() {
        if (Object.keys(cache).length) {
            timeoutRunning = true;
            setTimeout(checkTimeout, 1000); //check every second
        } else {
            timeoutRunning = false;
        }
    }
    
    function isNumber(v) {        
        return toString.call(v) == '[object Number]';
    }
    function isObject(o) {
        return o === Object(o);
    }
    
    return {
        get: get,
        set: set,
        remove: remove,
        removeAt: removeAt,
        removeAll: removeAll,
        ensure: ensure
    }
});