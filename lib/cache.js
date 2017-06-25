'use strict';

/**
** @author: kekobin@163.com
** @file 缓存node层通过接口访问的数据，减少node端的压力，默认缓存有效期60s
**/
var Cache = (function() {
	var _cache = {};

	return {
		set: function(name, data) {
			var info = {};

			info.data = data;
			info.expires = Date.now();

			if(_cache[name] && _cache[name].data) {
				delete _cache[name].data;
			}

			_cache[name] = info;
		},
		get: function(name) {
			return _cache[name] || {};
		}
	};
})();


module.exports = Cache;