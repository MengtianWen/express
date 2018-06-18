/**
 * Created by luneice on 17-9-2.
 */
/*
 * 上传文件的逻辑
 * 选择文件
 * 设置文件属性
 * 检查文件属性
 * 上传
 * 上传时禁用再次选择文件
 * 重复上传时检查两次文件是否一致
 * */
;(function (window) {
	var A_F = A_F || {};
	/*模型层*/
	A_F.M = (function () {
		var urllib = window.OSS.urllib;
		var OSS = window.OSS.Wrapper;
		var Buffer = window.OSS.Buffer;
		var STS = window.OSS.STS;

		/*获取OSS口令*/
		var ossClient = function (func) {
			var appServer = "https://luneice.com/alioss/sts/token?op=pr&t=" + new Date().getTime();
			var bucket = 'sharedocs';
			var endpoint = 'https://oss-cn-beijing.aliyuncs.com';
			return urllib.request(appServer, {
				method: 'get'
			}).then(function (result) {
				var creds = JSON.parse(result.data);
				client = new OSS({
					accessKeyId: creds.AccessKeyId,
					accessKeySecret: creds.AccessKeySecret,
					stsToken: creds.SecurityToken,
					endpoint: endpoint,
					bucket: bucket
				});
				return func(client);
			});
		};

		/*专业选择列表*/
		Vue.component('special-item', {
			template: '<li v-on:click="hide">{{ title }}</li>',
			props: ['title', 'id'],
			methods: {
				hide: function () {
					specialList.special = this.title;
					specialList.specialid = this.id;
					specialList.specialListShow = false;
				}
			}
		});

		var specialList = new Vue({
			el: '.special-cont',
			data: {
				special: '',
				specialid: '',
				now: -1,
				local: [
					{id: '080901', title: '计算机科学与技术'},
					{id: '080902', title: '软件工程'},
					{id: '080801', title: '自动化'},
					{id: '080601', title: '电气工程及其自动化'},
					{id: '080714T', title: '电子信息科学与技术'},
					{id: '080701', title: '电子信息工程'},
					{id: '080202', title: '机械设计制造及其自动化'},
					{id: '120701', title: '工业工程'},
					{id: '080205', title: '工业设计'},
					{id: '130504', title: '产品设计'},
					{id: '130502', title: '视觉传达设计'},
					{id: '080203', title: '材料成型及控制工程'},
					{id: '080401', title: '材料科学与工程'},
					{id: '080207', title: '车辆工程'},
					{id: '080208', title: '汽车服务工程'},
					{id: '080501', title: '热能与动力工程'},
					{id: '120601', title: '物流管理'},
					{id: '120202', title: '市场营销'},
					{id: '120102', title: '信息管理与信息系统'},
					{id: '120204', title: '财务管理'},
					{id: '120503', title: '信息资源管理'},
					{id: '020401', title: '国际经济与贸易'},
					{id: '120901K', title: '旅游管理'},
					{id: '030101K', title: '法学'},
					{id: '050201', title: '英语'},
					{id: '080705', title: '光电信息科学与工程'},
					{id: '080402', title: '材料物理'},
					{id: '070101', title: '数学与应用数学'},
					// {id: 38, title: '计算机辅助设计与制造'},
					// {id: 39, title: '计算机应用技术'},
					// {id: 40, title: '应用电子技术'},
					// {id: 41, title: '（科）机械制造与自动化'},
					// {id: 42, title: '（科）数控技术'},
					// {id: 43, title: '（科）模具设计与制造'},
					// {id: 44, title: '（科）工业设计'},
					// {id: 45, title: '（科）材料成型与控制技术'},
					// {id: 46, title: '（科）焊接技术及自动化'},
					// {id: 47, title: '（科）汽车运用技术'},
					// {id: 48, title: '（科）汽车检测与维修技术'},
					// {id: 49, title: '（科）汽车电子技术'},
					// {id: 50, title: '（科）金融管理与实务'},
					// {id: 51, title: '（科）会计'},
					// {id: 52, title: '（科）会计电算化'},
					// {id: 53, title: '（科）国际贸易实务'},
					// {id: 54, title: '（科）市场营销'},
					// {id: 55, title: '（科）电子商务'},
					// {id: 56, title: '（科）旅游管理'},
					// {id: 57, title: '（科）行政管理'},
					// {id: 58, title: '（科）商务英语'}
				],
				specialListShow: false,
				todos: [
					{id: '080901', title: '计算机科学与技术'},
					{id: '080902', title: '软件工程'},
					{id: '080801', title: '自动化'},
					{id: '080601', title: '电气工程及其自动化'},
					{id: '080714T', title: '电子信息科学与技术'},
					{id: '080701', title: '电子信息工程'},
					{id: '080202', title: '机械设计制造及其自动化'},
					{id: '120701', title: '工业工程'},
					{id: '080205', title: '工业设计'},
					{id: '130504', title: '产品设计'},
					{id: '130502', title: '视觉传达设计'},
					{id: '080203', title: '材料成型及控制工程'},
					{id: '080401', title: '材料科学与工程'},
					{id: '080207', title: '车辆工程'},
					{id: '080208', title: '汽车服务工程'},
					{id: '080501', title: '热能与动力工程'},
					{id: '120601', title: '物流管理'},
					{id: '120202', title: '市场营销'},
					{id: '120102', title: '信息管理与信息系统'},
					{id: '120204', title: '财务管理'},
					{id: '120503', title: '信息资源管理'},
					{id: '020401', title: '国际经济与贸易'},
					{id: '120901K', title: '旅游管理'},
					{id: '030101K', title: '法学'},
					{id: '050201', title: '英语'},
					{id: '080705', title: '光电信息科学与工程'},
					{id: '080402', title: '材料物理'},
					{id: '070101', title: '数学与应用数学'},
					// {id: 38, title: '计算机辅助设计与制造'},
					// {id: 39, title: '计算机应用技术'},
					// {id: 40, title: '应用电子技术'},
					// {id: 41, title: '（科）机械制造与自动化'},
					// {id: 42, title: '（科）数控技术'},
					// {id: 43, title: '（科）模具设计与制造'},
					// {id: 44, title: '（科）工业设计'},
					// {id: 45, title: '（科）材料成型与控制技术'},
					// {id: 46, title: '（科）焊接技术及自动化'},
					// {id: 47, title: '（科）汽车运用技术'},
					// {id: 48, title: '（科）汽车检测与维修技术'},
					// {id: 49, title: '（科）汽车电子技术'},
					// {id: 50, title: '（科）金融管理与实务'},
					// {id: 51, title: '（科）会计'},
					// {id: 52, title: '（科）会计电算化'},
					// {id: 53, title: '（科）国际贸易实务'},
					// {id: 54, title: '（科）市场营销'},
					// {id: 55, title: '（科）电子商务'},
					// {id: 56, title: '（科）旅游管理'},
					// {id: 57, title: '（科）行政管理'},
					// {id: 58, title: '（科）商务英语'}
				]
			},
			methods: {
				changed:function (event) {
					if(event.keyCode === 38 || event.keyCode === 40) return;
					console.log(this.special);
					this.specialListShow = true;
					var temp = this.local;
					var stack = [];
					for (var key in temp){
						var keyword = this.special.trim();
						var item = temp[key].title;
						if (item.match(new RegExp(keyword))){
							stack.push(temp[key]);
						}
					}
					this.todos = stack;
					if(event.keyCode === 13){
					}
				},
				selectDown:function () {
					this.now++;
				},
				selectUp:function () {
					this.now--;
				}
			}
		});

		/*年级选择列表*/
		Vue.component('date-item', {
			template: '<li v-on:click="hide">{{ title }}</li>',
			props: ['title', 'id'],
			methods: {
				hide: function () {
					dateList.date = this.title;
					dateList.dateid = this.id;
					dateList.dateListShow =! dateList.dateListShow;
				}
			}
		});

		var dateList = new Vue({
			el: '.date-cont',
			data: {
				dateListShow: false,
				date: '',
				dateid: '',
				todos: [
					{id: 2017, title: '2017级'},
					{id: 2016, title: '2016级'},
					{id: 2015, title: '2015级'},
					{id: 2014, title: '2014级'},
					{id: 2013, title: '2013级'}
				]
			}
		});
		/*文件对象*/
		var File = function (option) {
			var fileinfo = option || {};
			return fileinfo;
		};
		return{
			ossClient: ossClient,
			Buffer: Buffer,
			specialList,
			dateList,
			File: File
		}
	})();

	/*视图层*/
	A_F.V = (function () {
		var M = A_F.M;
		var doc = document;
		var toggle = function (str) {
			var notice = $('.notice')[0];
			notice.innerText = str;
			$('.notice-cont').stop(true).fadeIn().delay(800).fadeOut();
		};
		var view = {
			progress: function (p) {
				/*上传的进度*/
				return function (done) {
					var bar = doc.getElementById('progress-bar');
					bar.style.width = Math.floor(p * 100) + '%';
					done();
				}
			},
			notice: {
				sellectFile: function () {
					toggle('请选择要上传的文档');
				},
				fileIsSame: function () {
					toggle('该文档已经上传过了');
				},
				setFileAttr: function () {
					toggle('请设置文档的属性');
				}
			},
			changeBC: function (ex_name, filename) {
				/*切换文件文件的背景*/
				var file_bc = $('.file-bc');
				$('.filename')[0].innerText = filename;
				file_bc.css({
					"background": 'url("../image/' + ex_name + '.svg ") no-repeat center',
					"background-size": "50%"
				});
			},
			reset: {
				/*当文件修改时，重置一些东西*/
				file: function () {
					var bar = doc.getElementById('progress-bar');
					bar.style.width = Math.floor(0) + '%';
					M.specialList.special = '';
					M.specialList.specialid = '';
					M.dateList.date = '';
					M.dateList.dateid = '';
				}
			}
		};

		return {
			progress: view.progress,
			changeBC: view.changeBC,
			notice: view.notice,
			reset: view.reset
		}
	})();

	/*控制层*/
	A_F.C = (function () {
		var M = A_F.M;
		var V = A_F.V;
		var dir, file, filename = '';
		var uploaded = '';
		/*对象存储管理*/
		var oss_admin = {
			save: function (res) {
				/*上传的目录地址以及文件的基本属性*/
				var url = '/alioss/callback';
				qwest.post(url, {
					type: "",
					name: "",
					url: res.url,
					attach:{
						path: res.name,
						spec: M.specialList.specialid,
						time: M.dateList.dateid || new Date().getFullYear(),
						inst: '电气与信息工程学院',
						author: ''
					}
				}, {
					dataType: 'json',
					responseType: 'json'
				}).then(function(xhr, response) {
					// Make some useful actions
				}).catch(function(e, xhr, response) {
					// Process the error
				});
			}
		};
		/*文件与对象存储交互*/
		var file_op = {
			list: function (client) {
				return client.list({
					'max-keys': 100
				}).then(function (result) {
					/*获取OSS中的文件*/
					var objects = result.objects;
					console.log(objects);
				});
			},
			upload: function (client) {
				/*上传文件*/
				return client.multipartUpload(dir + '/' + filename, file, {
					progress: V.progress
				}).then(function (res) {
					/*上传成功后*/
					V.changeBC('success', filename + '(上传成功！)');
					/*判断两次上传的文件是否一致*/
					uploaded = filename;

					if (res.res.status === 200) oss_admin.save(res);
					return file_op.list(client);
				});
			},
			isSelect: function () {
				return filename === '';
			},
			attrNotSet: function () {
				/*返回布尔值，没有设置文件属性则返回true*/
				return M.specialList.special === '';
			},
			isSame: function () {
				return uploaded === filename;
			}
		};
		var doc = document;
		/*获取文件对象*/
		var file_target = doc.getElementById('file');
		/*选择了另外一个文件*/
		file_target.onchange = function () {
			try {
				var ext_name = '';
				file = this.files[0];
				filename = file.name;  // 文件名
				var reg = /\.(jpg|jpeg|png|bmp|txt|doc|docx|pdf|ppt|zip|rar|7z|tar|gz|xz|c|cpp|java|jar)$/;
				var result = filename.match(reg);
				if (result !== null){
					ext_name = result[1];
				}else {
					ext_name = 'unknown';
				}
				/*修改背景*/
				V.changeBC(ext_name, filename);
				/*进度置0*/
				V.reset.file();
				/*文件夹正则判断*/
				var type_reg = {
					'image': /^(jpg|jpeg|png|bmp)/,
					'doc': /^(txt|doc|docx|pdf)/,
					'zip': /^(zip|rar|7z|tar|gz|xz)/,
					'code': /^(c|cpp|java|jar)/,
					'other': 'unknown'
				};
				for (var key in type_reg){
					/*判断选择的文件类型*/
					if (new RegExp(type_reg[key]).test(ext_name)){
						dir = key;
					}
				}
			}catch (e){}
		};

		doc.getElementById('file-button').onclick = function () {
			/*检查是否选定了文件*/
			if (file_op.isSelect()){
				V.notice.sellectFile();
				return;
			}
			/*检查文件的属性设置了没*/
			else if (file_op.attrNotSet()){
				V.notice.setFileAttr();
				return;
			}
			/*如果两次的上传的文件相同则不会上传*/
			else if (file_op.isSame()){
				V.notice.fileIsSame();
				return;
			}
			M.ossClient(file_op.upload);
		};
	})();

	window.A_F = A_F;

})(window);
