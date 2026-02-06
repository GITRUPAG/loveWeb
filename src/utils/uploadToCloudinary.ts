export async function uploadToCloudinary(file: File): Promise<string> {
  if (!file) throw new Error("No file selected");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error("Cloudinary env variables missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", "love-nest");

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();

    // This is the URL we store in DB
    return data.secure_url;

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}
