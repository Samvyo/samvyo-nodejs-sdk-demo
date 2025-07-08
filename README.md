# samvyo-nodejs-sdk-demo
This is a demo application of processing mp4 files to hls using Samvyo NodeJs SDK

# Project Setup

## Step 1: Dashboard Registration and Login
1. Visit [app.samvyo.com](https://app.samvyo.com) to access the Samvyo dashboard
2. If you don't have an account, register a new account
3. If you already have an account, login with your credentials

## Step 2: Generate API Keys
1. After logging in, navigate to **Settings** in the dashboard
2. Select the **API Keys** tab
3. Generate your **Access Key** and **Secret Access Key**
4. Keep these keys secure as they will be used for authentication

## Step 3: Environment Configuration
1. In your project directory, rename `.env.sample` to `.env`
2. Add your generated keys to the `.env` file:
   ```
   ACCESS_KEY=your_access_key_here
   SECRET_ACCESS_KEY=your_secret_access_key_here
   ```

## Step 4: Storage Settings Configuration
For file processing to work, you must configure storage settings in the dashboard:

1. Go to **Settings** > **Storage Settings** in the dashboard
2. Configure the following details:
   - **Cloud Provider**: Digital Ocean (currently the only supported provider)
   - **Bucket Name**: Your Digital Ocean bucket name
   - **Access Key**: Your Digital Ocean access key
   - **Secret Access Key**: Your Digital Ocean secret access key
   - **Region**: Your bucket region

**Important**: Without proper storage configuration, file processing will fail. The SDK needs access to your cloud storage to read input files and write processed output files.

## Step 5: Optional - Default Output Quality Settings
1. Navigate to **Settings** > **Recording Settings** in the dashboard
2. Select up to three resolutions that will be used as default for processing
3. If not configured, the system will use default qualities of [720p, 360p]

## Step 6: Running the Application
1. Install dependencies: `npm install`
2. Start the server: `npm start` or `node server.js`
3. The server will run on the configured port (default: 3600)

## Step 7: API Usage
Call the `/api/file-processing` endpoint with the following request body format:

```json
{
  "inputFiles": [{
    "type": "mp4",
    "url": "https://your-bucket.region.digitaloceanspaces.com/videos/input.mp4",
    "key": "videos/folder1/folder2" // optional
  }],
  "outputQualities": ["360p", "720p", "1080p"], // optional
  "bucket": "your-bucket", // optional
  "region": "your-region" // optional
}
```

### Parameters:
- **inputFiles** (required): Array of MP4 files to process
- **outputQualities** (optional): Desired output resolutions
- **bucket** (optional): Override default bucket from dashboard settings
- **region** (optional): Override default region from dashboard settings

## Step 8: Monitor Processing
1. Once processing starts, you can monitor progress in the dashboard
2. Go to **Usage** > **Processing Logs** to view processing status and logs
3. The API will emit events for processing status updates

## Documentation
For detailed documentation and advanced usage, visit: [https://www.samvyo.com/docs/javascript-sdk-implementation/fileProcessing](https://www.samvyo.com/docs/javascript-sdk-implementation/fileProcessing)

## Important Notes
- Ensure your storage settings are properly configured before attempting file processing
- Processing credits will be deducted based on processing time, even if upload fails
- Recommended batch size: Up to 10 files per batch, each under 100MB
- For files larger than 100MB, process them individually for optimal performance


