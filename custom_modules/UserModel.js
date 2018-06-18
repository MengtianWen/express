/**
 * Created by luneice on 17-10-17.
 */

/*
 * 生成用户模型
 * */
var UserModel = function (option) {
	if ((option === undefined) || (typeof option !== 'object'))
		return {
			empty: true
		};
	var user = {
		username: null,
		password: null,
		email: null
	};
	for (var key in user){
		user[key] = option[key] === undefined ? user[key] : option[key];
	}
	return user
};

module.exports = UserModel;