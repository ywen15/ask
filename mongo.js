var mongoose = require('mongoose');
var url = 'mongodb://heroku_0f48fn51:tt7e43vuck0gejasffb25nb7ap@ds027155.mongolab.com:27155/heroku_0f48fn51';
//var url = 'mongodb://localhost:27017/';
//var url = process.env.MONGOLAB_URI;
var dbname = 'ask';
var db = null;
var User = null;
var Result = null;

var UserSchema = new mongoose.Schema({
  userid: { type: Number, index: { unique: true } },
  name: { type: String },
  type: { type: String },
  competency: { type: String },
  cookie: { type: String },
  corrects: { type: Number, default: 0, index: true },
  points: { type: Number, default: 0.0, index: true }
});
var ResultSchema = new mongoose.Schema({
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  period: { type: Number, index: true },
  question: { type: Number, index: true },
  answer: { type: String },
  time: { type: Number, default: 0.0 }
});

mongoose.model('User', UserSchema);
mongoose.model('Result', ResultSchema);
//mongoose.connect(url + dbname);
mongoose.connect(url);

db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function() {
  console.log(db);
  console.log('Connected to ' + dbname);
  User = mongoose.model('User');
  Result = mongoose.model('Result');
  populateDB();
});

exports.findUser = function(req, res) {
  User.findOne({ userid: parseInt(req.params.userid) }, function(err, result) {
    if(err) res.send({ 'error': 'An error has occurred while finding user' });
    else {
      res.json(result);
    }
  });
}

exports.registerUser = function(req, res) {
  req.session.userid = req.params.userid;

  User.where({ userid: req.params.userid }).update({ cookie: req.sessionID }, function(err, result) {
    if(err) res.send({ 'error': 'failed to save cookie' });
    else res.redirect('/answer/' + req.params.userid);
  });
}

exports.getAns = function(req, res) {
  User.findOne({ userid: parseInt(req.params.userid) }, function(err, result) {
    Result.findOne({ question: parseInt(req.params.question) }, function(e, r) {
      r._user = result;
      console.log(r);
      res.json(r);
    });
  });
}

exports.submitAns = function(req, res) {
  User.findOne({ userid: parseInt(req.body.userid) }, function(err, result) {
    if(err) {  }
    else {
      Result.create({
        _user: result._id,
        period: parseInt(req.body.period),
        question: parseInt(req.body.question),
        answer: req.body.answer,
        time: parseFloat(req.body.time)
      });
    }
  });
}

exports.updateStat = function(req, res) {
  User.where({ userid: parseInt(req.body.userid) })
  .update({ $inc: { corrects: 1, points: parseFloat(req.body.time) } }, function(err, result) {
    if(err) console.log(err);
    else console.log(result);
  });
}

exports.getDist = function(req, res) {
  Result.aggregate([
    { $match: { question: parseInt(req.params.question) } },
    { $group: { _id: '$answer', y: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ], function(err, result) {
    if(err) console.log(err);
    else {
      res.json(result);
    }
  });
}

exports.getRank = function(req, res) {
  Result.find({ question: req.params.question, answer: req.params.answer }, {},
    { sort: { time: 1 }, limit: 10 }).populate('_user').exec(function(err, result) {
    if(err) console.log(err);
    else {
      res.json(result);
    }
  });
}

exports.getOverall = function(req, res) {
  User.find({ corrects: { $ne: 0 } }, {},
    { sort: { corrects: -1, points: 1 } }, function(err, result) {
    if(err) console.log(err);
    else res.json(result);
  });
}

exports.resetDB = function(req, res) {
  User.update({}, { $set: { corrects: 0, points: 0 } }, function(err, result) {
    res.json();
  });
  Result.remove({}, function(err, result) {
    res.json();
  });
}

function populateDB() {
  User.remove({}, function() {});
  Result.remove({}, function() {});
  User.create([{"userid":355784,"name":"今橋 昌峰","competency":"ITS#1","type":"FY14"},
{"userid":356287,"name":"熊 巧迪","competency":"ITS#1","type":"FY14"},
{"userid":356576,"name":"鳥羽 真司","competency":"ITS#1","type":"FY14"},
{"userid":356758,"name":"西村 優","competency":"ITS#1","type":"FY14"},
{"userid":357087,"name":"増田 蕗野","competency":"ITS#1","type":"FY14"},
{"userid":356246,"name":"張 美","competency":"ITS#1","type":"FY14"},
{"userid":356279,"name":"徐 会容","competency":"ITS#1","type":"FY14"},
{"userid":357541,"name":"淺野 俊","competency":"ITS#1","type":"FY15"},
{"userid":357749,"name":"泉川 大樹","competency":"ITS#1","type":"FY15"},
{"userid":358192,"name":"片所 ケツテイ","competency":"ITS#1","type":"FY15"},
{"userid":358267,"name":"加藤 志織","competency":"ITS#1","type":"FY15"},
{"userid":358317,"name":"川﨑 恵里子","competency":"ITS#1","type":"FY15"},
{"userid":358663,"name":"小林 藍香","competency":"ITS#1","type":"FY15"},
{"userid":358747,"name":"五領 舞衣","competency":"ITS#1","type":"FY15"},
{"userid":359919,"name":"蒋 珉亮","competency":"ITS#1","type":"FY15"},
{"userid":360180,"name":"田中 智也","competency":"ITS#1","type":"FY15"},
{"userid":360248,"name":"張 嘉軒","competency":"ITS#1","type":"FY15"},
{"userid":360438,"name":"中尾 友美","competency":"ITS#1","type":"FY15"},
{"userid":360750,"name":"野﨑 兼司","competency":"ITS#1","type":"FY15"},
{"userid":361212,"name":"許 碩元","competency":"ITS#1","type":"FY15"},
{"userid":361410,"name":"松口 佳奈枝","competency":"ITS#1","type":"FY15"},
{"userid":361949,"name":"渡邊 泰成","competency":"ITS#1","type":"FY15"},
{"userid":361998,"name":"小林 祥平","competency":"ITS#1","type":"FY15"},
{"userid":358614,"name":"胡 克龍","competency":"ITS#3","type":"FY15"},
{"userid":359877,"name":"徐 歩杰","competency":"ITS#3","type":"FY15"},
{"userid":358820,"name":"齋藤 碧","competency":"ITS#1","type":"FY15"},
{"userid":361014,"name":"平林 阿子","competency":"ITS#3","type":"FY15"},
{"userid":361964,"name":"渡邊 裕記","competency":"ITS#3","type":"FY15"},
{"userid":361667,"name":"柳澤 隆広","competency":"ITS#1","type":"FY15"},
{"userid":361816,"name":"李 惠","competency":"ITS#1","type":"FY15"},
{"userid":361873,"name":"劉 广昊","competency":"ITS#1","type":"FY15"},
{"userid":361428,"name":"松坂 祐輔","competency":"ITS#3","type":"FY15"},
{"userid":358846,"name":"齋藤 里菜","competency":"ITS#3","type":"FY15"},
{"userid":357939,"name":"大内 奏太","competency":"ITS#3","type":"FY15"},
{"userid":358275,"name":"加藤 大祐","competency":"ITS#1","type":"FY15"},
{"userid":358234,"name":"片平 健太郎","competency":"ITS#1","type":"FY15"},
{"userid":357962,"name":"大西 佳孝","competency":"ITS#1","type":"FY15"},
{"userid":362012,"name":"大森 悠介","competency":"ITS#1","type":"FY15"},
{"userid":362079,"name":"佐藤 麗奈","competency":"ITS#1","type":"FY15"},
{"userid":362111,"name":"田村 和成","competency":"ITS#1","type":"FY15"},
{"userid":355834,"name":"殷 清揚","competency":"ITS#2","type":"FY14"},
{"userid":357434,"name":"林 雪亭","competency":"ITS#2","type":"FY14"},
{"userid":355727,"name":"礒谷 朋矢","competency":"ITS#2","type":"FY14"},
{"userid":355792,"name":"岩上 恵理子","competency":"ITS#2","type":"FY14"},
{"userid":355826,"name":"岩森 俊哉","competency":"ITS#2","type":"FY14"},
{"userid":355867,"name":"云 海","competency":"ITS#2","type":"FY14"},
{"userid":357129,"name":"松永 岳人","competency":"ITS#2","type":"FY14"},
{"userid":357475,"name":"相澤 美希","competency":"ITS#2","type":"FY15"},
{"userid":357525,"name":"阿久津 美菜萌","competency":"ITS#2","type":"FY15"},
{"userid":357616,"name":"荒川 一誠","competency":"ITS#2","type":"FY15"},
{"userid":357624,"name":"新城 拓","competency":"ITS#2","type":"FY15"},
{"userid":357863,"name":"浦川 佑介","competency":"ITS#2","type":"FY15"},
{"userid":358044,"name":"小笠原 寛明","competency":"ITS#2","type":"FY15"},
{"userid":358325,"name":"河田 潔恩","competency":"ITS#2","type":"FY15"},
{"userid":358366,"name":"木我 紅音","competency":"ITS#2","type":"FY15"},
{"userid":359992,"name":"須藤 暢也","competency":"ITS#2","type":"FY15"},
{"userid":360230,"name":"張 文禎","competency":"ITS#2","type":"FY15"},
{"userid":360743,"name":"能村 美香","competency":"ITS#2","type":"FY15"},
{"userid":361170,"name":"文 永斌","competency":"ITS#2","type":"FY15"},
{"userid":361683,"name":"山﨑 茜","competency":"ITS#2","type":"FY15"},
{"userid":361824,"name":"李 穎霏","competency":"ITS#2","type":"FY15"},
{"userid":358879,"name":"坂下 凜","competency":"ITS#3","type":"FY15"},
{"userid":358564,"name":"栗之丸 悟史","competency":"ITS#2","type":"FY15"},
{"userid":360115,"name":"髙見 健太","competency":"ITS#3","type":"FY15"},
{"userid":359844,"name":"周 思寒","competency":"ITS#3","type":"FY15"},
{"userid":360297,"name":"陳 嘉龍","competency":"ITS#2","type":"FY15"},
{"userid":359745,"name":"佐古 朝美","competency":"ITS#3","type":"FY15"},
{"userid":361444,"name":"松本 彩","competency":"ITS#2","type":"FY15"},
{"userid":360693,"name":"任 潔冰","competency":"ITS#3","type":"FY15"},
{"userid":360834,"name":"花岡 良尚","competency":"ITS#3","type":"FY15"},
{"userid":361030,"name":"深見 夏輝","competency":"ITS#3","type":"FY15"},
{"userid":361972,"name":"ワヒウ プルノモ","competency":"ITS#3","type":"FY15"},
{"userid":361311,"name":"前川 知央","competency":"ITS#2","type":"FY15"},
{"userid":358440,"name":"木下 美玖莉","competency":"ITS#2","type":"FY15"},
{"userid":358150,"name":"尾関 啓一","competency":"ITS#2","type":"FY15"},
{"userid":357897,"name":"王 穎芬","competency":"ITS#2","type":"FY15"},
{"userid":357871,"name":"遠藤 理子","competency":"ITS#2","type":"FY15"},
{"userid":361790,"name":"吉塚 恭平","competency":"ITS#2","type":"FY15"},
{"userid":362020,"name":"工藤 真悠","competency":"ITS#2","type":"FY15"},
{"userid":356717,"name":"西井 望","competency":"Cn#1","type":"FY14"},
{"userid":356725,"name":"西尾 香","competency":"Cn#1","type":"FY14"},
{"userid":357079,"name":"牧野 邦彦","competency":"Cn#1","type":"FY14"},
{"userid":356634,"name":"永瀬 詩文","competency":"Cn#1","type":"FY14"},
{"userid":356741,"name":"西原 拓未","competency":"Cn#1","type":"FY14"},
{"userid":357012,"name":"堀内 誉","competency":"Cn#1","type":"FY14"},
{"userid":357426,"name":"劉 旭睿","competency":"Cn#1","type":"FY14"},
{"userid":355859,"name":"梅田 志桜里","competency":"Cn#1","type":"FY14"},
{"userid":357889,"name":"王 穎","competency":"Cn#1","type":"FY15"},
{"userid":358242,"name":"勝 恵衣","competency":"Cn#1","type":"FY15"},
{"userid":358291,"name":"唐鎌 宏行","competency":"Cn#1","type":"FY15"},
{"userid":358515,"name":"木村 歩","competency":"Cn#1","type":"FY15"},
{"userid":358531,"name":"金 蘭","competency":"Cn#1","type":"FY15"},
{"userid":358887,"name":"坂田 真唯","competency":"Cn#1","type":"FY15"},
{"userid":360131,"name":"髙山 恵実","competency":"Cn#1","type":"FY15"},
{"userid":360594,"name":"中村 木綿","competency":"Cn#1","type":"FY15"},
{"userid":360776,"name":"朴 ジュヨン","competency":"Cn#1","type":"FY15"},
{"userid":361048,"name":"福井 穂香","competency":"Cn#1","type":"FY15"},
{"userid":361832,"name":"李 ズイ","competency":"Cn#1","type":"FY15"},
{"userid":362087,"name":"王子 真綺","competency":"Cn#1","type":"FY15"},
{"userid":357277,"name":"森 周太","competency":"Cn#2","type":"FY14"},
{"userid":355685,"name":"池田 琢也","competency":"Cn#2","type":"FY14"},
{"userid":355982,"name":"尾和 恵美加","competency":"Cn#2","type":"FY14"},
{"userid":356790,"name":"林 翔太","competency":"Cn#2","type":"FY14"},
{"userid":357392,"name":"李 雪琪","competency":"Cn#2","type":"FY14"},
{"userid":356139,"name":"黒河 緑","competency":"Cn#2","type":"FY14"},
{"userid":356261,"name":"朱 雅江","competency":"Cn#2","type":"FY14"},
{"userid":357053,"name":"前原 美穂","competency":"Cn#2","type":"FY14"},
{"userid":355941,"name":"岡田 朗","competency":"Cn#2","type":"FY14"},
{"userid":357210,"name":"三宅 由貴","competency":"Cn#2","type":"FY14"},
{"userid":358028,"name":"岡 佑樹","competency":"Cn#2","type":"FY15"},
{"userid":358119,"name":"荻野 桃子","competency":"Cn#2","type":"FY15"},
{"userid":358283,"name":"加藤 奈々美","competency":"Cn#2","type":"FY15"},
{"userid":358457,"name":"木場 喬介","competency":"Cn#2","type":"FY15"},
{"userid":358465,"name":"金 ジウォン","competency":"Cn#2","type":"FY15"},
{"userid":360271,"name":"張 迪韵","competency":"Cn#2","type":"FY15"},
{"userid":360370,"name":"寺西 藍","competency":"Cn#2","type":"FY15"},
{"userid":360388,"name":"杜 妍","competency":"Cn#2","type":"FY15"},
{"userid":360784,"name":"橋本 尚義","competency":"Cn#2","type":"FY15"},
{"userid":361766,"name":"山本 千枝子","competency":"Cn#2","type":"FY15"},
{"userid":361923,"name":"渡邉 香織","competency":"Cn#2","type":"FY15"},
{"userid":353649,"name":"稲田 愛美","competency":"Cn#3","type":"FY14"},
{"userid":356493,"name":"チャン ハートゥ","competency":"Cn#3","type":"FY14"},
{"userid":357145,"name":"松本 健太","competency":"Cn#3","type":"FY14"},
{"userid":357194,"name":"三部 理沙子","competency":"Cn#3","type":"FY14"},
{"userid":356535,"name":"丁 云劼","competency":"Cn#3","type":"FY14"},
{"userid":356360,"name":"関 美菜子","competency":"Cn#3","type":"FY14"},
{"userid":355990,"name":"解 嬋辛","competency":"Cn#3","type":"FY14"},
{"userid":356691,"name":"西 縁","competency":"Cn#3","type":"FY14"},
{"userid":356931,"name":"藤原 武彦","competency":"Cn#3","type":"FY14"},
{"userid":357061,"name":"前原 裕貴","competency":"Cn#3","type":"FY14"},
{"userid":356048,"name":"河井 直彦","competency":"Cn#3","type":"FY14"},
{"userid":356543,"name":"出口 正竜","competency":"Cn#3","type":"FY14"},
{"userid":356782,"name":"早川 泰","competency":"Cn#3","type":"FY14"},
{"userid":357228,"name":"宮地 あかね","competency":"Cn#3","type":"FY14"},
{"userid":357640,"name":"李 智雅","competency":"Cn#3","type":"FY15"},
{"userid":357681,"name":"石井 恵美","competency":"Cn#3","type":"FY15"},
{"userid":357814,"name":"岩本 こころ","competency":"Cn#3","type":"FY15"},
{"userid":357921,"name":"王 砺","competency":"Cn#3","type":"FY15"},
{"userid":358051,"name":"尾形 友里恵","competency":"Cn#3","type":"FY15"},
{"userid":358069,"name":"岡留 友梨映","competency":"Cn#3","type":"FY15"},
{"userid":358077,"name":"岡村 愛由佳","competency":"Cn#3","type":"FY15"},
{"userid":358788,"name":"齋藤 翔太","competency":"Cn#3","type":"FY15"},
{"userid":359786,"name":"佐野 令佳","competency":"Cn#3","type":"FY15"},
{"userid":359828,"name":"下野 紗英","competency":"Cn#3","type":"FY15"},
{"userid":359836,"name":"朱 子穎","competency":"Cn#3","type":"FY15"},
{"userid":359885,"name":"徐 ルル","competency":"Cn#3","type":"FY15"},
{"userid":359927,"name":"辛 奉燮","competency":"Cn#3","type":"FY15"},
{"userid":359935,"name":"ズォンティ ホンゴック","competency":"Cn#3","type":"FY15"},
{"userid":360081,"name":"髙瀬 加奈","competency":"Cn#3","type":"FY15"},
{"userid":360651,"name":"縄田 遥","competency":"Cn#3","type":"FY15"},
{"userid":360669,"name":"仁木 貴之","competency":"Cn#3","type":"FY15"},
{"userid":360727,"name":"禰宜田 真奈","competency":"Cn#3","type":"FY15"},
{"userid":360867,"name":"馬場 遼太","competency":"Cn#3","type":"FY15"},
{"userid":360958,"name":"杭 イジュアン","competency":"Cn#3","type":"FY15"},
{"userid":361089,"name":"藤井 柾樹","competency":"Cn#3","type":"FY15"},
{"userid":361162,"name":"藤原 照恭","competency":"Cn#3","type":"FY15"},
{"userid":361238,"name":"ホールデン 理沙マリー","competency":"Cn#3","type":"FY15"},
{"userid":361386,"name":"松岡 誠造","competency":"Cn#3","type":"FY15"},
{"userid":361436,"name":"松延 萌菜","competency":"Cn#3","type":"FY15"},
{"userid":361550,"name":"村岡 ショーン豪","competency":"Cn#3","type":"FY15"},
{"userid":356121,"name":"金 昶均","competency":"Cn#4","type":"FY14"},
{"userid":355743,"name":"伊東 哲志","competency":"Cn#4","type":"FY14"},
{"userid":356667,"name":"中村 茉衣","competency":"Cn#4","type":"FY14"},
{"userid":356170,"name":"境 一樹","competency":"Cn#4","type":"FY14"},
{"userid":356352,"name":"炭井 紗也佳","competency":"Cn#4","type":"FY14"},
{"userid":355719,"name":"伊勢田 浩太","competency":"Cn#4","type":"FY14"},
{"userid":355735,"name":"伊藤 彩夏","competency":"Cn#4","type":"FY14"},
{"userid":357152,"name":"松本 幸子ソニア","competency":"Cn#4","type":"FY14"},
{"userid":355628,"name":"淺沼 慎太","competency":"Cn#4","type":"FY14"},
{"userid":358259,"name":"勝山 春華","competency":"Cn#4","type":"FY15"},
{"userid":359711,"name":"索 娜","competency":"Cn#4","type":"FY15"},
{"userid":360040,"name":"孫 一舟","competency":"Cn#4","type":"FY15"},
{"userid":360065,"name":"高川 ゆう","competency":"Cn#4","type":"FY15"},
{"userid":360073,"name":"髙﨑 周士","competency":"Cn#4","type":"FY15"},
{"userid":360321,"name":"逵 公平","competency":"Cn#4","type":"FY15"},
{"userid":360859,"name":"馬場 聡美","competency":"Cn#4","type":"FY15"},
{"userid":360883,"name":"濱名 早智","competency":"Cn#4","type":"FY15"},
{"userid":360933,"name":"早坂 卓樹","competency":"Cn#4","type":"FY15"},
{"userid":361352,"name":"益田 孝俊","competency":"Cn#4","type":"FY15"},
{"userid":361725,"name":"山田 夏子","competency":"Cn#4","type":"FY15"},
{"userid":356378,"name":"髙瀨 秀樹","competency":"Cn#5","type":"FY14"},
{"userid":356451,"name":"田中 浩基","competency":"Cn#5","type":"FY14"},
{"userid":357236,"name":"宮永 恭佑","competency":"Cn#5","type":"FY14"},
{"userid":356659,"name":"中村 か奈子","competency":"Cn#5","type":"FY14"},
{"userid":356329,"name":"鈴木 彬","competency":"Cn#5","type":"FY14"},
{"userid":356972,"name":"彭 雪","competency":"Cn#5","type":"FY14"},
{"userid":356899,"name":"藤田 大洋","competency":"Cn#5","type":"FY14"},
{"userid":356212,"name":"佐藤 夏来","competency":"Cn#5","type":"FY14"},
{"userid":357533,"name":"浅井 翔太郎","competency":"Cn#5","type":"FY15"},
{"userid":357780,"name":"井上 美和子","competency":"Cn#5","type":"FY15"},
{"userid":358358,"name":"姜 藝珍","competency":"Cn#5","type":"FY15"},
{"userid":359893,"name":"蒋 毅","competency":"Cn#5","type":"FY15"},
{"userid":360099,"name":"髙橋 陽子","competency":"Cn#5","type":"FY15"},
{"userid":360487,"name":"永作 一輝","competency":"Cn#5","type":"FY15"},
{"userid":360842,"name":"馬場 明子","competency":"Cn#5","type":"FY15"},
{"userid":361188,"name":"文 先伊","competency":"Cn#5","type":"FY15"},
{"userid":361279,"name":"本田 彩奈子","competency":"Cn#5","type":"FY15"},
{"userid":361337,"name":"前野 友里","competency":"Cn#5","type":"FY15"},
{"userid":361931,"name":"渡邉 秀","competency":"Cn#5","type":"FY15"},
{"userid":356444,"name":"竹鼻 綾乃","competency":"Cn#6","type":"FY14"},
{"userid":356881,"name":"藤瀬 里奈","competency":"Cn#6","type":"FY14"},
{"userid":356824,"name":"東 太輝","competency":"Cn#6","type":"FY14"},
{"userid":356915,"name":"藤墳 新菜","competency":"Cn#6","type":"FY14"},
{"userid":356097,"name":"菊地 史登","competency":"Cn#6","type":"FY14"},
{"userid":356477,"name":"チェルニチ ジョルジェ","competency":"Cn#6","type":"FY14"},
{"userid":357368,"name":"吉野 遼平","competency":"Cn#6","type":"FY14"},
{"userid":355669,"name":"荒井 優希","competency":"Cn#6","type":"FY14"},
{"userid":355644,"name":"東 欣一","competency":"Cn#6","type":"FY14"},
{"userid":357558,"name":"朝飛 れいな","competency":"Cn#6","type":"FY15"},
{"userid":357798,"name":"岩瀬 詩織","competency":"Cn#6","type":"FY15"},
{"userid":358549,"name":"工藤 瑞生","competency":"Cn#6","type":"FY15"},
{"userid":358689,"name":"小林 建登","competency":"Cn#6","type":"FY15"},
{"userid":358762,"name":"蔡 潤萍","competency":"Cn#6","type":"FY15"},
{"userid":359968,"name":"鈴木 絢子","competency":"Cn#6","type":"FY15"},
{"userid":360255,"name":"張 馨恬","competency":"Cn#6","type":"FY15"},
{"userid":360636,"name":"中村 里奈","competency":"Cn#6","type":"FY15"},
{"userid":360974,"name":"東内 敦","competency":"Cn#6","type":"FY15"},
{"userid":361022,"name":"ファム クィンアイ","competency":"Cn#6","type":"FY15"},
{"userid":361196,"name":"ペレーラ アローシュ","competency":"Cn#6","type":"FY15"},
{"userid":361675,"name":"柳原 有沙","competency":"Cn#6","type":"FY15"},
{"userid":361774,"name":"山元 陸","competency":"Cn#6","type":"FY15"},
{"userid":357095,"name":"松井 翼","competency":"Cn#7","type":"FY14"},
{"userid":357418,"name":"李 東瀛","competency":"Cn#7","type":"FY14"},
{"userid":355693,"name":"石島 聡子","competency":"Cn#7","type":"FY14"},
{"userid":356220,"name":"澤田 智彦","competency":"Cn#7","type":"FY14"},
{"userid":356428,"name":"竹井 もゆこ","competency":"Cn#7","type":"FY14"},
{"userid":356626,"name":"永沢 和久","competency":"Cn#7","type":"FY14"},
{"userid":356113,"name":"菊原 琴乃","competency":"Cn#7","type":"FY14"},
{"userid":356063,"name":"川本 卓馬","competency":"Cn#7","type":"FY14"},
{"userid":356733,"name":"西田 紗矢香","competency":"Cn#7","type":"FY14"},
{"userid":356873,"name":"ファム ニーブン","competency":"Cn#7","type":"FY14"},
{"userid":357038,"name":"馬 可遥","competency":"Cn#7","type":"FY14"},
{"userid":357483,"name":"秋田 優輝","competency":"Cn#7","type":"FY15"},
{"userid":357699,"name":"石井 香帆","competency":"Cn#7","type":"FY15"},
{"userid":357822,"name":"呉 岱霓","competency":"Cn#7","type":"FY15"},
{"userid":358135,"name":"奥田 麻菜美","competency":"Cn#7","type":"FY15"},
{"userid":358481,"name":"金 スルギ","competency":"Cn#7","type":"FY15"},
{"userid":358598,"name":"倪 全","competency":"Cn#7","type":"FY15"},
{"userid":358853,"name":"酒井 めぐみ","competency":"Cn#7","type":"FY15"},
{"userid":358861,"name":"坂井田 遼","competency":"Cn#7","type":"FY15"},
{"userid":359810,"name":"清水 由美","competency":"Cn#7","type":"FY15"},
{"userid":359869,"name":"周 ブンカツ","competency":"Cn#7","type":"FY15"},
{"userid":360149,"name":"多田 蒔","competency":"Cn#7","type":"FY15"},
{"userid":360289,"name":"張 ロイ","competency":"Cn#7","type":"FY15"},
{"userid":360412,"name":"笘野 倭子","competency":"Cn#7","type":"FY15"},
{"userid":360479,"name":"中川 理生","competency":"Cn#7","type":"FY15"},
{"userid":360735,"name":"根本 葉月","competency":"Cn#7","type":"FY15"},
{"userid":360826,"name":"服部 翔大","competency":"Cn#7","type":"FY15"},
{"userid":360917,"name":"早川 颯一郎","competency":"Cn#7","type":"FY15"},
{"userid":361139,"name":"藤沢 廉","competency":"Cn#7","type":"FY15"},
{"userid":361394,"name":"松金 俊介","competency":"Cn#7","type":"FY15"},
{"userid":361451,"name":"松本 彩希","competency":"Cn#7","type":"FY15"},
{"userid":361493,"name":"見田 真木子","competency":"Cn#7","type":"FY15"},
{"userid":361634,"name":"森本 真由","competency":"Cn#7","type":"FY15"},
{"userid":361691,"name":"山﨑 啓史","competency":"Cn#7","type":"FY15"},
{"userid":361899,"name":"林 耘曲","competency":"Cn#7","type":"FY15"},
{"userid":361980,"name":"王 晨希","competency":"Cn#7","type":"FY15"},
{"userid":533265,"name":"木村 泰徳","competency":"CbD","type":"LEADER"},
{"userid":232363,"name":"飯島 明子","competency":"ITS#1","type":"LINE"},
{"userid":271940,"name":"藤岡 里織","competency":"ITS#2","type":"LINE"},
{"userid":319178,"name":"中村 葉子","competency":"ITS#3","type":"LINE"},
{"userid":328542,"name":"松田 憲太","competency":"Cn#1","type":"LINE"},
{"userid":531426,"name":"大村 鋼三郎","competency":"Cn#2","type":"LINE"},
{"userid":314393,"name":"沖 順子","competency":"Cn#3","type":"LINE"},
{"userid":284091,"name":"加藤 重光","competency":"Cn#4","type":"LINE"},
{"userid":521153,"name":"川口 善照","competency":"Cn#5","type":"LINE"},
{"userid":532218,"name":"岡田 誠司","competency":"Cn#6","type":"LINE"},
{"userid":525477,"name":"板倉 美和","competency":"Cn#7","type":"LINE"},
{"userid":null}]);
  /*var users = [];
  var results = [];
  User.remove({}, function() {});
  Result.remove({}, function() {});
  for(var i=0; i<200; ++i) {
    users.push({ userid: 350000 + i * 10, name: 'Name' + i, type: 'FY' + i, competency: 'C' + i, corrects: Math.floor(Math.random() * 10), points: Math.floor(Math.random() * 50) });
  }
  User.create(users);

  User.find(function(err, result) {
    if(err) console.log(err);
    for(var r=0; r<result.length; ++r) {
      for(var i=1; i<=54; ++i) {
        Result.create({
          _user: result[r]._id,
          period: 1,
          question: i,
          answer: (i == 7 || i == 54 || i == 17 || i == 25 || i == 34 || i == 40 || i == 47) ? '4213' : '' + Math.floor((Math.random() * 4) + 1),
          time: Math.floor((Math.random() * 10) + 1)
        });
      }
    }
  });*/
}