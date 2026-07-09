import { v2 as cloudinary } from 'cloudinary';

// 1. Configure Cloudinary with inline credentials
cloudinary.config({
  cloud_name: 'is3sxbac',
  api_key: '415236238748476',
  api_secret: 'GF7Jl42f4m5nLNE94o5ksDV5heo',
  secure: true
});

async function main() {
  try {
    console.log("Starting Cloudinary Onboarding Script...");
    console.log("Uploading sample image to Cloudinary...");

    // 2. Upload a sample image from Cloudinary's demo domain
    const uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/dog.jpg',
      {
        folder: 'cloudinary_onboarding'
      }
    );

    console.log("Upload Success!");
    console.log(`Secure URL: ${uploadResult.secure_url}`);
    console.log(`Public ID: ${uploadResult.public_id}`);

    console.log("\nFetching image details from Cloudinary API...");
    // 3. Fetch image details to get metadata
    const details = await cloudinary.api.resource(uploadResult.public_id);
    console.log(`Width: ${details.width}px`);
    console.log(`Height: ${details.height}px`);
    console.log(`Format: ${details.format}`);
    console.log(`File Size: ${details.bytes} bytes`);

    console.log("\nGenerating transformed image URL...");
    // 4. Transform the image:
    // fetch_format: 'auto' (f_auto) -> Delivers the image in the best format supported by the requesting browser (e.g. WebP, AVIF).
    // quality: 'auto' (q_auto) -> Dynamically adjusts compression to minimize file size while preserving visual quality.
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
      secure: true
    });

    console.log("\nDone! Click link below to see optimized version of the image. Check the size and the format.");
    console.log(transformedUrl);

  } catch (error) {
    console.error("Error occurred during Cloudinary verification:", error);
  }
}

main();
