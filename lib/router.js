'use strict';
/**
 ** @author: kekobin@163.com
 ** @file 根据配置动态初始化路由
 **{
 **	"demo": {
 **		"pages": [
 **			{
 **				"page": "index", //页面名称，对应访问的路由和html
 **				"urls": [
 **					{
 **						"name": "", //api名称，在模版中对请求结果的引用
 **						"url":""
 **					}
 **				],
 **				"cache": true//是否缓存
 **			}
 **		]
 **	}
 **}
 **/

var path = require('path');
var fs = require('fs');
var extend = require('extend');
var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
// var apiConf = require('../config/apiConf');
var request = require('./request');
var Cache = require('./cache');
var uploadError = false;
var expiresGap = 60000; //数据缓存有效期
var apiConf = {}; //根据每个项目view下面的apiConf配置文件合成

function initApiConf(callback) {
	var viewsDir = path.join(__dirname, '../views/');
	var fileList = fs.readdirSync(viewsDir);
	var dirList = [];

	//过滤出目录
	fileList.forEach(function(item) {
		if (fs.statSync(viewsDir + item).isDirectory()) {
			dirList.push(item);
		}
	});

	//找出每个目录下的apiConf.js合成
	dirList.forEach(function(item) {
		var confPath = viewsDir + item + '/apiConf.js';
		extend(true, apiConf, require(confPath));
	});

	console.log(JSON.stringify(apiConf))

	callback();
}

function initRouter() {
	for (var appName in apiConf) {
		var appConf = apiConf[appName],
			pages = appConf.pages;

		pages.forEach(function(pageItem) {
			var urls = pageItem['urls'],
				page = pageItem['page'],
				cacheData = pageItem['cache'],
				urlPrefix = cacheData ? '/' : '/live/',
				routeUrl = urlPrefix + appName + '/' + page;
console.log('=======================')
console.log(appName)
console.log(pageItem)
console.log(routeUrl)

			router.get(routeUrl, function(req, res, next) {
				var proCache = Cache.get(appName),
					proData = proCache.data,
					pagePath = path.join(__dirname, '../views/' + appName + 'View/' + page);
				//判断当前项目数据是否在有效缓存中
	console.log('===========inner============')
	console.log(appName)
	console.log(routeUrl)
	console.log(pagePath)

				if (cacheData && proData && (Date.now() - proCache.expires) < expiresGap) {
					proData.yyuid = req.cookies.yyuid;
					// res.render(path.join(__dirname, '../views/' + page), proData);
					res.render(pagePath, proData);
				} else {
					request(req, urls, function(data) {
						//添加缓存信息到缓存系统
						Cache.set(appName, data);

						//根据这个在页面中判断是否登录
						data.yyuid = req.cookies.yyuid;
						res.render(pagePath, data);
						// res.render(path.join(__dirname, '../views/' + page), data);
					});
				}
			});
		});
	}
}

module.exports = function(ROOT_PATH) {
	initApiConf(function() {
		initRouter();
	});

	return router;
};