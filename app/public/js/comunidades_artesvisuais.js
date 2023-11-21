function displayFileName() {
    var input = document.getElementById('img_divulgacao');
    var fileName = document.getElementById('file-name');

    if (input.files.length > 0) {
        fileName.textContent = input.files[0].name;
    } else {
        fileName.textContent = "Escolha uma imagem";
    }
}