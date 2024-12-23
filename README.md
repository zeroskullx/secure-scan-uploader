# File Upload and Virus Scanning API

This project implements a file upload service with built-in virus scanning using the Avast antivirus CLI. The solution addresses the challenge of securely handling file uploads while minimizing the risk of virus propagation. Uploaded files are scanned for viruses, with logs of the scan results stored in a MySQL database. Files are accepted via an API endpoint, and strict file size limits are enforced to ensure efficient processing.

---

## Challenge

The main challenge was to create a secure and efficient file upload system that:

1. Ensures every uploaded file is scanned for viruses.
2. Avoids re-scanning files unnecessarily when duplicates are uploaded.
3. Provides logging and traceability of scan results for each file.
4. Stores metadata in a relational database for easy tracking.
5. Limits the file size to 1MB for controlled resource usage.

---

## Solution

The solution involves:

1. **File Upload Handling:** Using the Fastify framework, the API accepts file uploads via a dedicated endpoint.
2. **Virus Scanning:** The Avast CLI is leveraged to scan uploaded files for potential threats.
3. **Result Logging:** Scan results (e.g., clean or infected) are saved in a MySQL database using Prisma ORM.
4. **File Storage:** Files are archived locally on the server with unique filenames derived from their contents.
5. **Error Handling and Fault Tolerance:** Comprehensive error handling ensures smooth operation and detailed logging of failures.

---

## Tools and Technologies

### **Framework:**

- **Fastify**: Chosen for its performance and lightweight nature, ideal for handling file uploads efficiently.

### **Database:**

- **MySQL**: Used to store metadata about uploaded files and scan results, ensuring traceability and easy querying.
- **Prisma**: Simplifies database interactions with an intuitive TypeScript-based ORM.

### **Virus Scanning:**

- **Avast CLI**: Executes the antivirus scan locally on the server. Scan results are parsed and stored for further reference.

---

## API Overview

### **Endpoint:**

- `POST /upload`

### **Request:**

- **Headers:**
  - `Content-Type: multipart/form-data`
- **Body:**
  - `file` (required): The file to be uploaded. Maximum size: **1MB**.

### **Response:**

- **200 OK** (File uploaded and scanned successfully)
  ```json
  {
    "message": "File uploaded and scanned successfully",
    "scanResult": "clean"
  }
  ```
- **400 Bad Request** (File exceeds size limit or missing file)
  ```json
  {
    "error": "File size exceeds limit or no file provided"
  }
  ```
- **500 Internal Server Error** (Scan failed or unexpected error)
  ```json
  {
    "error": "Internal server error"
  }
  ```

---

## Installation and Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/zeroskullx/secure-scan-uploader.git
   cd securescan-uploader
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the environment:**
   Create a `.env` file and set the following variables:

   ```env
   PORT=3333
   DATABASE_URL=mysql://user:password@localhost:3306/your_database
   FILE_UPLOAD_DIR=/path/to/upload/directory
   AVAST_CLI_PATH=/path/to/avast
   ```

4. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the server:**
   ```bash
   npm run dev:watch
   ```

---

## How It Works

1. **File Upload:** Users upload files via the `/upload` endpoint. Files exceeding the 1MB limit are rejected.
2. **Virus Scanning:** The server invokes the Avast CLI to scan the uploaded file. Scan results are logged to a file and stored in the database.
3. **Archival:** Files are stored locally with a unique name based on their content hash to avoid duplicates.
4. **Database Logging:** Metadata such as file name, scan result, and upload timestamp are stored in MySQL for reference.

---

## Example Usage

### Request

```bash
curl -X POST -F "file=@example.txt" http://example.com/upload
```

### Response

```json
{
  "message": "File uploaded and scanned successfully",
  "scanResult": "clean"
}
```

---

## Future Improvements

1. **Support for Cloud Storage:** Integrate with S3 or Azure Blob Storage for file storage.
2. **Distributed Scanning:** Leverage cloud-based antivirus APIs for scalability.
3. **Enhanced Metadata Tracking:** Store additional file attributes, such as user ID or file tags.
4. **Scalability Enhancements:** Introduce rate limiting and distributed processing for handling high traffic.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contributions

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
