Credit Card Statement Parser -
An intelligent parser that extracts key information from credit card statements. Upload a PDF to automatically get details like issuer, amount due, due date, and a full transaction list in a clean, easy-to-read format.

I HAVE DEPLOYED IT ON VERCEL- https://sf-credit-card-statement-parser.vercel.app/

Features -
Drag & Drop Upload: Easily upload PDF statements.
AI-Powered Extraction: Uses Google Gemini API to accurately parse statement content.
Structured Output: Extracts issuer, balance, due date, and transactions.
Responsive UI: Built with React and Tailwind CSS for a seamless experience on any device.
Secure: Files are processed securely; data is not stored.
Error Handling: Clear feedback if parsing fails or the file is invalid.

How It Works - 
Upload PDF: Select or drag and drop your statement.
Base64 Conversion: File is converted in the browser.
API Call: The Base64 PDF is sent to Gemini API for structured JSON output.
Display Results: Parsed data is shown in a clear summary and transaction table.

Tech Stack - 
Frontend: React, TypeScript, Tailwind CSS
AI Model: Google Gemini (gemini-2.5-flash)
API Client: @google/genai SDK
Bundling: ES Modules with Import Maps
