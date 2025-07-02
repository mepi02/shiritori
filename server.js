// server.js
import { serveDir } from "jsr:@std/http/file-server";
// 直前の単語を保持しておく
let previousWord = "しりとり";
let wordHistories = []; //履歴を保存
//プレイヤーの名前
let player_nameList = [
    "player_A",
    "player_B",
    "player_C",
    "player_D",
    "player_E",
    "player_F",
    "player_G",
    "player_H",
    "player_I",
    "player_J",
];
let player_number = 2; //プレイヤーの人数
wordHistories = wordHistories.concat(previousWord);
let player_count = 0; //どのプレイヤーかを表す
let player; //プレイヤーがだれか
let player_;
let gameOver_status; //エラーのステータスを受け取る

// localhostにDenoのHTTPサーバーを展開
Deno.serve(async (_req) => {
    // パス名を取得する
    // http://localhost:8000/hoge に接続した場合"/hoge"が取得できる
    const pathname = new URL(_req.url).pathname;
    console.log(`pathname: ${pathname}`);

    // GET /shiritori: 直前の単語を返す
    if (_req.method === "GET" && pathname === "/shiritori") {
        return new Response(previousWord);
    }

    // GET /gameOver_status: 終わった理由を返す
    if (_req.method === "GET" && pathname === "/gameOver_status") {
        if (gameOver_status === 401) {
            return new Response("んがついてるよ");
        } else if (gameOver_status === 402) {
            return new Response("同じ文字が使用されています");
        }
    }

    // GET /gameOver_name: 誰で終わったかを返す
    if (_req.method === "GET" && pathname === "/gameOver_name") {
        console.log(player_);
        if (player_ - 1 < 0) {
            player_ = player_number - 1;
        } else {
            player_ -= 1;
        }
        player = player_nameList[player_];
        return new Response(player);
    }

    // GET /gameOver_name: 今のプレイヤーの名前を返す
    if (_req.method === "GET" && pathname === "/player") {
        if (player_count < player_number) {}
        else {
            player_count = 0;
        }
        player_ = player_count;
        player = player_nameList[player_count];
        player_count += 1;
        return new Response(player);
    }

    // GET /wordList: 履歴を返す
    if (_req.method === "GET" && pathname === "/wordList") {
        return new Response(wordHistories);
    }

    // GET /wordList: 人数を返す
    if (_req.method === "GET" && pathname === "/setting_Player_nember") {
        return new Response(player_number);
    }

    //人数設定
    if (_req.method === "POST" && pathname === "/player_setting") {
        // リクエストのペイロードを取得
        const requestJson = await _req.json();

        const nember = requestJson["count"];
        let entries = requestJson["entries"];
        for (let i = 0; i < nember; i++) {
            player_nameList[i] = entries[i];
        }
        player_number = nember;
        console.log(player_number);
        return new Response(JSON.stringify({}), {});
    }

    // POST /shiritori: 次の単語を受け取って保存する
    if (_req.method === "POST" && pathname === "/shiritori") {
        // リクエストのペイロードを取得
        const requestJson = await _req.json();
        // JSONの中からnextWordを取得
        const nextWord = requestJson["nextWord"];

        //ひらがなのみか？
        if (/^[ぁ-んー]*$/.test(nextWord)) {
            if (previousWord.slice(-1) === nextWord.slice(0, 1)) {
                //最後に「ん」が付いているか？
                if (nextWord.slice(-1) === "ん") {
                    gameOver_status = 401;
                    return new Response(
                        JSON.stringify({
                            "errorMessage": "最後がんになっています",
                            "errorCode": "10002",
                        }),
                        {
                            status: 401,
                            headers: {
                                "Content-Type":
                                    "application/json; charset=utf-8",
                            },
                        },
                    );
                } //同じ文字が使われているか？
                else if (0 < wordHistories.indexOf(nextWord)) {
                    gameOver_status = 402;
                    return new Response(
                        JSON.stringify({
                            "errorMessage": "同じものを出しています",
                            "errorCode": "10003",
                        }),
                        {
                            status: 402,
                            headers: {
                                "Content-Type":
                                    "application/json; charset=utf-8",
                            },
                        },
                    );
                } else {
                    // 同一であれば、previousWordを更新
                    wordHistories = wordHistories.concat(nextWord);
                    previousWord = nextWord;
                    console.log(wordHistories);
                }
            } // 同一でない単語の入力時に、エラーを返す
            else {
                return new Response(
                    JSON.stringify({
                        "errorMessage": "前の単語に続いていません",
                        "errorCode": "10001",
                    }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                    },
                );
            }
        } else {
            gameOver_status = 400;
            return new Response(
                JSON.stringify({
                    "errorMessage": "ひらがなで入力してください",
                    "errorCode": "10004",
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                },
            );
        }

        // 現在の単語を返す
        return new Response(previousWord);
    }

    // POST /reset: リセットする
    if (_req.method === "POST" && pathname === "/reset") {
        console.log("reset");
        wordHistories = [];
        previousWord = "しりとり";
        wordHistories = wordHistories.concat(previousWord);
        player_count = 0;
        return wordHistories;
    }

    // ./public以下のファイルを公開
    return serveDir(
        _req,
        {
            /*
            - fsRoot: 公開するフォルダを指定
            - urlRoot: フォルダを展開するURLを指定。今回はlocalhost:8000/に直に展開する
            - enableCors: CORSの設定を付加するか
            */
            fsRoot: "./public/",
            urlRoot: "",
            enableCors: true,
        },
    );
});
