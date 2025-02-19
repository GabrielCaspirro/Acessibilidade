const video = document.querySelector("video");

document.getElementById("uploadBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("videoFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecione um vídeo.");
        return;
    }

    const formData = new FormData();
    formData.append("video", file);

    fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("uploadedVideo").src = data.filePath;
    })
    .catch(error => console.error("Erro no upload:", error));
});

