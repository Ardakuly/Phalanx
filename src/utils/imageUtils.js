import axios from "axios";

/**
 * Resolves a product photo URL (potentially pointing to MinIO within the Docker network)
 * to a URL that the browser can directly download/display.
 *
 * Handles:
 * - Docker service name (http://phalanx-minio:9000/product-images/...) -> http://localhost:9000/product-images/...
 * - Absolute URLs -> returns as is
 * - Relative filenames (e.g. "apple.png") -> http://localhost:9000/product-images/apple.png
 */
export const getProductImageUrl = (photoUrl) => {
  if (!photoUrl || typeof photoUrl !== "string") return null;
  
  const trimmed = photoUrl.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    // If it contains the docker host 'phalanx-minio', replace with 'localhost' for the browser
    if (trimmed.includes("phalanx-minio:9000")) {
      return trimmed.replace("phalanx-minio:9000", "localhost:9000");
    }
    return trimmed;
  }

  // If it's just a filename or relative path, assume it belongs to the product-images bucket on localhost MinIO
  return `http://localhost:9000/product-images/${trimmed}`;
};

/**
 * Uploads a file directly to the MinIO container's product-images bucket.
 * Generates a unique filename using timestamp and a random string.
 * Returns the public URL of the uploaded image.
 */
export const uploadProductImage = async (file) => {
  if (!file) throw new Error("No file provided");

  // Generate a safe unique filename: timestamp + random string + sanitized original name
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${cleanName}`;
  
  const uploadUrl = `http://localhost:9000/product-images/${uniqueFilename}`;

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  return uploadUrl;
};
