# Google In-app payment sample

Node.jsで実装したGoogle In-app paymentのサンプルアプリ。DBとかの処理はモック的な感じなのでGoogleのサーバーとの一連の流れを確認できる程度。

課金が成功したらコンソールに

    save:
    { user: 10000, item: 2 }

とか出るはずなので実際はこれをDBとかに保存して課金の有無をチェックする。

## サーバーの起動

    $ git clone https://github.com/hokaccha/google-inapp-payment-sample-node.git
    $ cd google-inapp-payment-sample
    $ npm install
    $ npm start --port [port] # portはデフォルト3000番
    エディタが起動するんでsellerIdとsecretを入力してエディタを保存して終了する。
    問題なければサーバーが起動する。
    listen: [port]

## 注意点

* sandboxで動かない場合本番で動かしてみると動くかも（ただし実際に課金されるので注意）。その場合はviews/buy.htmlの`sandbox_config`を`production_config`に変える
* postbackのURLはGoogleから見えるURLを設定するべし（localhostとかはダメ）
