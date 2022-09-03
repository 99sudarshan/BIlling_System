export const fileHandler = (file, setFile, setFileError, setThumbnail) => {
  if (file) {
    const fileName = file.name;
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
      let arr = fileName.split(".");
      let extension = arr[arr.length - 1];
      const extensions = ["png", "jpg", "jpeg", "webp"];
      let bool = false;
      for (let i = 0; i < extensions.length; i++) {
        if (extensions[i] === extension) {
          bool = true;
          i = extensions.length;
        }
      }
      if (bool) {
        setFile(file);
        updateThumbnail(file, setThumbnail);
        setFileError("");
      } else {
        setFile("");
        setFileError("Invalid file");
      }
    };
    image.onerror = function () {
      // setcompanyImage("");
      setFileError("Invalid file");
    };
  }
};

const updateThumbnail = (file, setThumbnail) => {
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setThumbnail(reader.result);
    };
  }
};
