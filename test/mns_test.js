/* GET users listing. */

const MNS = require('aliyun-mns');
const mns_conf = require('../settings/custom_settings').ali_mns;
const mns = new MNS({
	accessKeyId: mns_conf.accessKeyId,
	secretAccessKey: mns_conf.secretAccessKey,
	endpoint: mns_conf.endpoint,
	apiVersion: mns_conf.apiVersion // 调用MNS接口的版本号，当前版本为2015-06-06
});

const topic = mns.topic('sms.topic-cn-beijing');
const message = topic.message();

var options = {
	smsParams: {
		code: '257748' // 短信参数
	},
	templateCode: 'SMS_104810007', // 模板ID
	freeSignName: '知了', // 短信签名
	receiver: '18772803312' // 接受者手机号
};

var param = {
	SmsParams: JSON.stringify(options.smsParams),
	TemplateCode: options.templateCode,
	Type: 'singleContent',
	FreeSignName: options.freeSignName,
	Receiver: options.receiver
};

message.publish({
	MessageBody: 'message',
	MessageAttributes: {
		DirectSMS: JSON.stringify(param)
	}
}).then(res => {
	console.log('Sussess:', res);
}).catch(res => {
	console.error('Failed:', res);
});