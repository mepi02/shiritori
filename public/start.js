let gameOver_messege = "しりとり";

globalThis.onload = async (_event) => {
    // id: previousWordのタグを取得
    const paragraph = document.querySelector("#gameOver_reason");
    const gameOver_check = await fetch("/gameOver_messege", { method: "GET" });
    const previousWord = await gameOver_check.text();
    // 取得したタグの中身を書き換える
    paragraph.innerHTML = `${previousWord}`;
};

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
