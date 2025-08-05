interface LogPayload {
  stack: string;
  level: string;
  package: string;
  message: string;
}

const API_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJtc2tjaGFpdGhhbnlhcmFqQGdtYWlsLmNvbSIsImV4cCI6MTc1NDM3NzQwMywiaWF0IjoxNzU0Mzc2NTAzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNDBhOGJmZDMtY2FkNC00MGE4LTg5Y2ItY2IwNGRmZWNhMWIwIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic3JpIGtyaXNobmEgY2hhaXRoYW55YSByYWogbWFzaW11a2t1Iiwic3ViIjoiNmIzNmQ5NmUtNjc4ZC00Mjc4LTk0M2EtNTRhNjkwYzJhYThlIn0sImVtYWlsIjoibXNrY2hhaXRoYW55YXJhakBnbWFpbC5jb20iLCJuYW1lIjoic3JpIGtyaXNobmEgY2hhaXRoYW55YSByYWogbWFzaW11a2t1Iiwicm9sbE5vIjoiMjI0ODFhMTJnMCIsImFjY2Vzc0NvZGUiOiJIYkRwcEciLCJjbGllbnRJRCI6IjZiMzZkOTZlLTY3OGQtNDI3OC05NDNhLTU0YTY5MGMyYWE4ZSIsImNsaWVudFNlY3JldCI6Ikh5eVlHV2djY1BKR3hGcVMifQ.M2VM8TJDQ2X12OdlPHK2e4sEFVLlZ-18_8Vn8ei1-nM";

export async function Log(
  stack: string,
  level: string,
  packageName: string,
  message: string
): Promise<void> {
  const payload: LogPayload = {
    stack,
    level,
    package: packageName,
    message,
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Logging failed:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Logger error:", error);
  }
}

// Frontend logging helpers
export const logger = {
  debug: (packageName: string, message: string) =>
    Log("frontend", "debug", packageName, message),
  info: (packageName: string, message: string) =>
    Log("frontend", "info", packageName, message),
  warn: (packageName: string, message: string) =>
    Log("frontend", "warn", packageName, message),
  error: (packageName: string, message: string) =>
    Log("frontend", "error", packageName, message),
  fatal: (packageName: string, message: string) =>
    Log("frontend", "fatal", packageName, message),
};
