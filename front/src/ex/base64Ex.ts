
export type ImageType = {
  id?: number;
  type: string;
  fileName: string;
  fileBase64: string;
};

export const _blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const { result } = reader;
      if (typeof result === "string") {
        res(result);
      } else {
        rej(new Error("readAsDataURL 결과값이 string이 아님"));
      }
    };
    reader.readAsDataURL(blob);
  });
};

export const fileToBase64 = async (file: File): Promise<{ type: string, fileName: string, fileBase64: string }> => {
  const dataUri = await _blobToBase64(file);
  return {
    type: file.type,
    fileName: file.name,
    fileBase64: dataUri.split(",")[1] ?? "",
  };
};
