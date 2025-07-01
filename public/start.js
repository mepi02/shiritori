document.querySelector("#gemaStart").onclick = async (_event) => {
    const nextWordInput = document.querySelector("#player_nember");
    const nextWordInputText = nextWordInput.value;

    const response = await fetch(
        "/player_nember",
        {
            method: "POST",
            body: JSON.stringify({ player_nember: nextWordInputText }),
        },
    );

    globalThis.location.href = "main.html";
};
