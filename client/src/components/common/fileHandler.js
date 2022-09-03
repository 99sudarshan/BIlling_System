export const fileHandler = (file, productName, setFile, setFileError) => {
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
        setFile({
          ...productName,
          name: fileName,
          file: file,
        });
        setFileError("");
      } else {
        setFile({
          ...productName,
          name: "",
          file: "",
        });
        setFileError("Invalid image type.");
      }
    };
    image.onerror = function () {
      // setcompanyImage("");
      setFileError("Invalid image type.");
    };
  }
};
