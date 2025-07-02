globalThis.onload = async (_event) => {
    const paragraph_setting_Player_nember = document.querySelector(
        "#setting_Player_nember",
    );
    const response = await fetch("/setting_Player_nember", { method: "GET" });
    const Player_nember = await response.text();
    paragraph_setting_Player_nember.innerHTML = `人数:${Player_nember}`;
};

document.querySelector("#gemaStart").onclick = async (_event) => {
    globalThis.location.href = "main.html";
};
