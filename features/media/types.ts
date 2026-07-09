export type MediaKind = "IMAGE" | "PDF" | "ZIP" | "VIDEO" | "FILE";

export type MediaFile = {
  id: string;
  kind: MediaKind;
  name: string;
  url: string;
  size: number;
};
