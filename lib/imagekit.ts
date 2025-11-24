import ImageKit from "imagekit-javascript";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

if (!urlEndpoint || !publicKey) {
    console.warn("ImageKit environment variables are missing. Image uploads will not work.");
}

const imagekit = new ImageKit({
    publicKey: publicKey || "",
    urlEndpoint: urlEndpoint || "",
    authenticationEndpoint: "/api/imagekit-auth",
});

export default imagekit;
