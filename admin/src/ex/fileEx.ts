import { isNil } from "lodash";
import { api } from "../api/api";

export const encodeFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const onNewAsset = async (file: File) => {
  const base64 = await encodeFileToBase64(file);

  const res = await api.newAsset({
    base64,
    contentType: file.type,
    name: file.name,
  });

  if (isNil(res)) {
    return null;
  }

  return res.bsset;
};
