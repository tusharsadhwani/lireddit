const sha1 = async (str: string) => {
  const buffer = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest("SHA-1", buffer);

  // Convert digest to hex string
  const result = Array.from(new Uint8Array(digest))
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");

  return result;
};
interface cloudinarySignatureKeys {
  publicId: string;
  timestamp: string;
  secret: string;
}
export const cloudinarySignature = ({
  publicId,
  timestamp,
  secret,
}: cloudinarySignatureKeys) => {
  const signature = `public_id=${publicId}&timestamp=${timestamp}${secret}`;
  const hash = sha1(signature);
  return hash;
};
