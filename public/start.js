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
