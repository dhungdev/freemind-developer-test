const fullName = document.getElementById("fullname");
const phoneNumber = document.getElementById("phone");
const position = document.getElementById("position");
const experience = document.getElementById("experience");
const image = document.getElementById("file");
const nameImage = document.getElementById("filename");
const email = document.getElementById("email");
const formApply = document.getElementById("form-apply");

const FULLNAME_REGEX =
    /[^a-z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/u;
const PHONE_REGEX = /^[0-9\-\+]{10,12}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMAGE_REGEX = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/;

let formInfo = {};
let isProcessingSubmit = false;

function error(element, nameError) {
    element.classList.add("invalid");
    element.parentElement.querySelector(".form-message").innerText = nameError;
}

function process(element) {
    element.classList.remove("invalid");
    element.parentElement.querySelector(".form-message").innerText = "";
}
// Function validate fullname
function validateFullname(value, onError) {
    if (!value || value.length == 0) {
        onError("Không được để trống họ và tên");
        return false;
    }
    if (!FULLNAME_REGEX.test(value)) {
        onError("Họ và tên không đúng định dạng");
        return false;
    }
    return true;
}

// Function validate phone number
function validatePhone(value, onError) {
    if (!value || value.length == 0) {
        onError("Không được để trống số điện thoại");
        return false;
    }
    if (!PHONE_REGEX.test(value)) {
        onError("Số điện thoại không đúng định dạng");
        return false;
    }
    return true;
}

// Function validate position
function validatePosition(value, onError) {
    if (!value || value.length == 0) {
        onError("Bạn cần phải chọn vị trí");
        return false;
    }
    return true;
}

// Function validate experience
function validateExperience(value, onError) {
    if (!value || value.length <= 2) {
        onError("Kinh nghiệm làm việc phải trên 2 ký tự");
        return false;
    }
    return true;
}

// Function validate image
function validateImage(files, onError) {
    if (!files || files.length == 0) {
        onError("Không được để trống ảnh");
        return false;
    }
    const name = files[0].name;
    if (!IMAGE_REGEX.test(name)) {
        onError("Ảnh không đúng định dạng");
        return false;
    }
    return true;
}

// Function validate email
function validateEmail(value, onError) {
    if (!value || value.length == 0) {
        onError("Không được để trống email");
        return false;
    }
    if (!EMAIL_REGEX.test(value)) {
        onError("Email không đúng định dạng");
        return false;
    }
    return true;
}

function onValidateFullnameError(message) {
    error(fullName, message);
}

function onValidatePhoneError(message) {
    error(phoneNumber, message);
}

function onValidatePositionError(message) {
    error(position, message);
}

function onValidateEmailError(message) {
    error(email, message);
}

function onValidateExperienceError(message) {
    error(experience, message);
}

function onValidateImageError(message) {
    error(image, message);
}

// Check fullname
fullName.addEventListener("blur", function () {
    formInfo.name = validateFullname(fullName.value, onValidateFullnameError)
        ? fullName.value
        : "";
});

fullName.addEventListener("input", function () {
    process(fullName);
});

// Check phone number
phoneNumber.addEventListener("blur", function () {
    formInfo.phone = validatePhone(phoneNumber.value, onValidatePhoneError)
        ? phoneNumber.value
        : "";
});
phoneNumber.addEventListener("input", function () {
    process(phoneNumber);
});

// Check position
position.addEventListener("blur", function () {
    formInfo.position = validatePosition(position.value, onValidatePositionError)
        ? position.value
        : "";
});
position.addEventListener("input", function () {
    process(position);
});

// Check Email
email.addEventListener("blur", function () {
    formInfo.email = validateEmail(email.value, onValidateEmailError)
        ? email.value
        : "";
});

email.addEventListener("input", function () {
    process(email);
});

image.addEventListener("change", function (event) {
    process(image);
    formInfo.files = validateImage(image.files, onValidateImageError)
        ? [...image.files]
        : null;
    if (formInfo.files) {
        nameImage.innerText = formInfo.files[0].name;
    } else {
        nameImage.innerText = "Đính kèm hình ảnh";
    }
});

// Check experience
experience.addEventListener("blur", function () {
    formInfo.exp = validateExperience(experience.value, onValidateExperienceError)
        ? experience.value
        : "";
});
experience.addEventListener("input", function () {
    process(experience);
});

function submitForm() {
    isProcessingSubmit = true;
    const formData = new FormData();

    Object.keys(formInfo).forEach((key) => {
        if (key !== "files") {
            formData.append(key, formInfo[key]);
        }
    });
    formData.append('picture', formInfo.files[0].name);
    fetch("https://freemind-test.netlify.app/.netlify/functions/test", {
        method: "POST",
        body: formData,
    })
        .then((result) => {
            console.log("Success:", result);
            alert("CV của bạn đã được gửi thành công!");
            fullName.value = "";
            phoneNumber.value = "";
            position.value = "";
            experience.value = "";
            nameImage.innerText = "Đính kèm hình ảnh";
            email.value = "";
        })
        .catch((error) => {
            console.error("Error:", error);
        })
        .finally(() => {
            isProcessingSubmit = false;
        });
}

formApply.addEventListener("submit", function (event) {
    if (isProcessingSubmit) {
        return;
    }

    event.preventDefault();

    const isValidFullname = validateFullname(formInfo.name, onValidateFullnameError);
    const isValidPhone = validatePhone(formInfo.phone, onValidatePhoneError);
    const isValidPosition = validatePosition(formInfo.position, onValidatePositionError);
    const isValidEmail = validateEmail(formInfo.email, onValidateEmailError);
    const isValidExperience = validateExperience(formInfo.exp, onValidateExperienceError);
    const isValidImage = validateImage(formInfo.files, onValidateImageError);

    const isValidForm = isValidFullname && isValidPhone && isValidPosition && isValidEmail && isValidExperience && isValidImage;

    if (isValidForm) {
        submitForm();
    } else {
        return;
    }
});
