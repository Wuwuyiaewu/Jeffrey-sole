// src/app/experience/tanstack-query/page.tsx
import ECQueryContent from "./ECQueryContent";
async function getInitialData() {
  // 1. 強制檢查 Token
  const rawToken = process.env.NEXT_PUBLIC_AUTH0_TOKEN;

  // 自動處理 Bearer 前綴，避免重複或遺漏
  const token = rawToken?.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

  console.log("🚀 Server Fetching with Token prefix:", token);

  try {
    const res = await fetch("http://localhost:8001/formQuery/search?page=0&size=10", {
      method: "POST",
      headers: {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/json",
        "authorization": `${token}`,
        "selected-group-code": "230001",
        // 💡 某些 Spring Security 會檢查這個
        "Referer": "http://localhost:3000/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      },
      body: JSON.stringify({
        "applyDateFrom": "",
        "applyDateTo": "",
        "completeDateFrom": "",
        "completeDateTo": "",
        "currentUserList": [],
        "deltaPartNos": [],
        "formNoList": [],
        "oaCode": "",
        "plantList": [],
        "productCodeList": [],
        "qtrFormNoList": [],
        "status": "ALL",
        "toolingIdList": [],
        "vendorPartNos": [],
        "vnCodeList": []
      }),
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorMsg = await res.text();
      // 這裡的 log 會出現在 VS Code Terminal
      console.error(`❌ API Error [${res.status}]:`, errorMsg);
      return { content: [], totalElements: 0, totalPages: 0, size: 10, number: 0 };
    }

    return res.json();
  } catch (error) {
    console.error("❌ Network Error:", error);
    return { content: [], totalElements: 0, totalPages: 0, size: 10, number: 0 };
  }
}

export default async function Page() {
  const initialData = await getInitialData();
  return <ECQueryContent initialData={initialData} />;
}