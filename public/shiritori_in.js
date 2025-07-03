var Word_List = [];
var Word_List_count = 0;

//前の単語を表示
globalThis.onload = async (_event) => {
    // GET /shiritoriを実行
    const response = await fetch("/shiritori", { method: "GET" });
    // responseの中からレスポンスのテキストデータを取得
    const previousWord = await response.text();
    // id: previousWordのタグを取得
    const paragraph = document.querySelector("#previousWord");
    // 取得したタグの中身を書き換える
    paragraph.innerHTML = `前の単語: ${previousWord}`;

    const paragraph_01 = document.querySelector("#Word_log");
    // 取得したタグの中身を書き換える
    paragraph_01.innerHTML = `履歴`;

    Word_List_count = 0;
    Word_List = Word_List.concat(previousWord);
    var Word_List_01 = document.createElement("li");
    Word_List_01.textContent = (Word_List_count + 1) + ":" +
        Word_List[Word_List_count];
    document.getElementById("Word_List").appendChild(Word_List_01);

    const response_player = await fetch("/player", { method: "GET" });
    const paragraph_player = document.querySelector("#player_space");
    const player_name = await response_player.text();
    paragraph_player.innerHTML = `現在のプレイヤーは${player_name}です。`;
};

// 送信ボタンの押下時に実行
document.querySelector("#nextWordSendButton").onclick = async (_event) => {
    // inputタグを取得
    const nextWordInput = document.querySelector("#nextWordInput");
    // inputの中身を取得
    const nextWordInputText = nextWordInput.value;
    // POST /shiritoriを実行
    // 次の単語をresponseに格納
    const response = await fetch(
        "/shiritori",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nextWord: nextWordInputText }),
        },
    );

    // status: 200以外が返ってきた場合にエラーを表示
    if (response.status !== 200) {
        if (response.status >= 401) {
            //ゲームオーバー
            globalThis.location.href = "gameOver.html";
        } else if (response.status === 400) {
            const errorJson = await response.text();
            const errorObj = JSON.parse(errorJson);
            alert(errorObj["errorMessage"]);
        }
    }

    const previousWord = await response.text();

    // id: previousWordのタグを取得
    const paragraph = document.querySelector("#previousWord");
    // 取得したタグの中身を書き換える
    paragraph.innerHTML = `前の単語: ${previousWord}`;

    Word_List_count += 1;
    Word_List = Word_List.concat(previousWord);
    var Word_List_01 = document.createElement("li");
    Word_List_01.textContent = (Word_List_count + 1) + ":" +
        Word_List[Word_List_count];
    document.getElementById("Word_List").appendChild(Word_List_01);

    const response_player = await fetch("/player", { method: "GET" });
    const paragraph_player = document.querySelector("#player_space");
    const player_name = await response_player.text();
    paragraph_player.innerHTML = `現在のプレイヤーは${player_name}です。`;

    // inputタグの中身を消去する
    nextWordInput.value = "";
    wordHistories.push = previousWord;
};

// リセット
document.querySelector("#resetSendButton").onclick = async (event) => {
    if (globalThis.confirm("リセットしてもよろしいですか？")) {
        await fetch(
            "/reset",
            {
                method: "POST",
            },
        );
        globalThis.location.reload();
    } else { // 「キャンセル」時の処理
        globalThis.alert("キャンセルされました"); // 警告ダイアログを表示
        return false; // リセットを中止
    }
};
