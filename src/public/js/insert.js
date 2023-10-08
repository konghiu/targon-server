const name_ = document.getElementById("name");
const price = document.getElementById("price");
const image = document.getElementById("image");
const form = document.getElementById("form__insert");
let file = null;

image.onchange = (e) => {
    file = e.target.files[0];
    const preview = URL.createObjectURL(file);
    document.getElementById("preview").src = preview;
};

form.onsubmit = async (e) => {
    e.preventDefault();
    if (!file || !name_.value || !price.value) {
        alert("Please fill all fields");
        return;
    }
    // create filename for image
    const filename = Date.now() + file.name;

    // create form data
    const formData = new FormData();
    formData.append("name", name_.value);
    formData.append("price", price.value);
    formData.append("image", file, filename);
    await fetch(form.action, {
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => alert(data.message))
        .catch((err) => console.log(err));
};
