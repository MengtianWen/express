/**
 * Created by luneice on 17-11-16.
 */

/*
 * 重定向配置文件
 * */

// path 为该项目的 public 目录
mysqldemo = {
	redirect: {
		home: './mysqldemo/index.html'
	}
};
oracledemo = {
	redirect: {
		home: './dbdemo/index.html'
	}
};

module.exports = {
	mysqldemo: mysqldemo,
	orcaledemo: oracledemo
};
