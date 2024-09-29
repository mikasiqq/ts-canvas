export const downloadImageData = async (
  canvas: HTMLCanvasElement,
  downloadName: string
) => {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );
  if (!blob) return;

  const link = document.createElement("a");
  link.download = downloadName;

  link.href = URL.createObjectURL(blob);

  link.click();
  URL.revokeObjectURL(link.href);
};
