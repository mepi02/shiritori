//終わった理由を表示
globalThis.onload = async (_event) => {
    const paragraph = document.querySelector("#gameOver_reason");
    const gameOver_status = await fetch("/gameOver_status", { method: "GET" });
    const gameOver_Message = await gameOver_status.text();
    // 取得したタグの中身を書き換える
    paragraph.innerHTML = `${gameOver_Message}`;

    const paragraph_name = document.querySelector("#gameOver_Name");
    const gameOver_name = await fetch("/gameOver_name", { method: "GET" });
    const gameOver_name_Message = await gameOver_name.text();
    // 取得したタグの中身を書き換える
    paragraph_name.innerHTML = `${gameOver_name_Message}で終わりました`;
};

//スタート画面にリセットした状態で遷移する
document.querySelector("#resetSendButton_start").onclick = async (event) => {
    const response_reset = await fetch(
        "/reset",
        {
            method: "POST",
        },
    );
    globalThis.location.reload();
    location.href = "./index.html";
    // POST /resetを実行
    // ページをリロードする
};

//しりとり画面にリセットした状態で遷移する
document.querySelector("#resetSendButton_one").onclick = async (event) => {
    const response_reset = await fetch(
        "/reset",
        {
            method: "POST",
        },
    );
    globalThis.location.reload();
    location.href = "./main.html";
    // POST /resetを実行
    // ページをリロードする
};
