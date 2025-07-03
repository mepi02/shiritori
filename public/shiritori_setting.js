const settingInput = document.querySelector("#player_nember");
const inputs = document.getElementById("inputs");

// 入力欄を指定数に更新する関数
function updateInputs(count) {
    const currentCount = inputs.querySelectorAll("input").length;

    if (count > currentCount) {
        // 増やす
        for (let i = currentCount; i < count; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.className = "input-field";
            input.placeholder = `player #${i + 1}`;
            inputs.appendChild(input);
            inputs.appendChild(document.createElement("p"));
        }
    } else if (count < currentCount) {
        // 減らす
        for (let i = currentCount; i > count; i--) {
            inputs.removeChild(inputs.lastElementChild);
        }
    }
    // 同じなら何もしない
}

updateInputs(parseInt(settingInput.value, 10));

settingInput.addEventListener("change", function () {
    const count = parseInt(this.value, 10);
    if (!isNaN(count)) {
        updateInputs(count);
    }
});

document.querySelector("#setting_ok").onclick = async (_event) => {
    const allInputs = inputs.querySelectorAll("input");
    const values = Array.from(allInputs).map((input) => input.value);
    const data = {
        count: values.length,
        entries: values,
    };

    await fetch(
        "/player_setting",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        },
    );

    globalThis.location.href = "index.html";
};
