import { GoogleGenAI, Type } from "@google/genai";
import { StatementData } from '../types';

const fileToGenerativePart = (base64Data: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
};

export async function parseCreditCardStatement(pdfBase64: string): Promise<StatementData> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = 'gemini-2.5-flash';
  const pdfPart = fileToGenerativePart(pdfBase64, "application/pdf");
  
  const prompt = `You are an expert financial data extraction tool. Analyze the provided credit card statement PDF and extract the following information precisely:
1.  Card Issuer: The name of the bank or financial institution (e.g., "Chase", "American Express", "Citi").
2.  Card Variant: The specific type of card (e.g., "Sapphire Preferred", "Gold Card", "Double Cash").
3.  Card Last 4 Digits: The last four digits of the credit card number.
4.  Billing Cycle: The start and end date of the statement period (e.g., "09/01/2023 - 09/30/2023").
5.  Payment Due Date: The date by which the payment must be made.
6.  Total Balance: The total balance that needs to be paid.
7.  Transactions: A list of all transactions, including date, description, and amount for each.

Return the extracted information in the specified JSON format. Ensure the totalBalance and transaction amounts are numbers, not strings.`;

  try {
    const result = await ai.models.generateContent({
      model: model,
      contents: { parts: [pdfPart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            issuerName: { type: Type.STRING, description: "Name of the card issuer." },
            cardVariant: { type: Type.STRING, description: "The specific variant of the card (e.g., Gold, Platinum)." },
            cardLast4: { type: Type.STRING, description: "Last 4 digits of the card number." },
            billingCycle: { type: Type.STRING, description: "The billing cycle period (e.g., 'MM/DD/YYYY - MM/DD/YYYY')." },
            dueDate: { type: Type.STRING, description: "The payment due date." },
            totalBalance: { type: Type.NUMBER, description: "The total balance due." },
            transactions: {
              type: Type.ARRAY,
              description: "A list of transactions from the statement.",
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING, description: "Date of the transaction." },
                  description: { type: Type.STRING, description: "Description of the transaction." },
                  amount: { type: Type.NUMBER, description: "Amount of the transaction." },
                },
                required: ["date", "description", "amount"],
              },
            },
          },
          required: ["issuerName", "cardVariant", "cardLast4", "billingCycle", "dueDate", "totalBalance", "transactions"],
        },
      },
    });

    const responseText = result.text.trim();
    const parsedData = JSON.parse(responseText);
    return parsedData as StatementData;

  } catch (error) {
    console.error("Error parsing statement with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to parse statement: ${error.message}`);
    }
    throw new Error("An unknown error occurred during parsing.");
  }
}
