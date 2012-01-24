var express = require('express');
var jwt = require('jwt-simple');
var confy = require('confy');
var model = require('./model');
var app = express.createServer();

confy.get('GoogleInappPayment', { require: {
  sellerId: '',
  secret: ''
}}, function(err, conf) {
  app.set('view engine', 'ejs');
  app.set('view options', { layout: false });
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());

  // トップページ。アイテムのリストが並ぶだけ
  app.get('/', function(req, res) {
    res.render('index', { items: model.item.getItems() });
  });

  // 商品ページ。ここでアイテムを購入できる
  app.get('/buy/:itemId', function(req, res) {
    var user = model.user.getCurrentUser();
    var item = model.item.get(req.params.itemId);

    // 購入情報（ホントはこれはモデルに書くけど）
    var payload = {
      iss: conf.sellerId,
      aud: 'Google',
      typ: 'google/payments/inapp/item/v1',
      iat: Math.round(Date.now()/1000),
      exp: Math.round(Date.now()/1000) + 3600,
      request: {
        currencyCode: item.currencyCode,
        price: item.price,
        name: item.name,
        description: item.description,
        sellerData: JSON.stringify({ // 文字列しか指定できないらしい
          user: user.id,
          item: item.id
        })
      }
    };

    res.render('buy', {
      jwt: jwt.encode(payload, conf.secret),
      item: item
    });
  });


  // ここはGoogleから呼ばれる
  app.post('/postback', function(req, res) {
    // jwtをデコード
    var payload = jwt.decode(req.body.jwt, conf.secret);

    // Googleからのリクエストはissとaudが逆になる
    if (payload.iss !== 'Google') {
      res.send('error', 500);
      return;
    }
    if (payload.aud !== conf.sellerId) {
      res.send('error', 500);
      return;
    }

    // アイテムの購入履歴を保存
    var sellerData = JSON.parse(payload.request.sellerData);
    model.payment.save({
      user: sellerData.user,
      item: sellerData.item
    }, function(err) {
      if (err) {
        // エラー処理
        res.send('error', 500);
        return;
      }
      else {
        // OKのレスポンス返す
        res.send(payload.response.orderId);
      }
    });
  });

  app.listen(process.env.npm_config_port || 3000);
  console.log('listen:', app.address().port);
});
