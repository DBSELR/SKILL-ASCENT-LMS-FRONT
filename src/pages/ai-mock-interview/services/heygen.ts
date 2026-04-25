export async function getHeyGenSessionToken(): Promise<string> {
   const apiKey = process.env.REACT_APP_HEYGEN_API_KEY || "sk_V2_hgu_kBsuvQSF6QV_Nt7eeQbtLnhPHXwiMBKCUx6XWSL2mwyD";
   
   if (!apiKey) {
      throw new Error("REACT_APP_HEYGEN_API_KEY is not defined");
   }

   try {
       const response = await fetch('https://api.liveavatar.com/v1/sessions/token', {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json',
             'X-API-KEY': apiKey,
          },
       });

       if (response.ok) {
           const data = await response.json();
           if (data?.data?.token) return data.data.token;
       }
   } catch (error) {
       console.log('LiveAvatar endpoint failed, trying HeyGen fallback...');
   }

   try {
       const response = await fetch('https://api.heygen.com/v1/streaming.create_token', {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json',
             'x-api-key': apiKey,
             'Authorization': `Bearer ${apiKey}`,
          },
       });

       if (!response.ok) {
           const errData = await response.json().catch(() => ({}));
           throw new Error(errData.message || `Failed to fetch valid token: ${response.status}`);
       }

       const data = await response.json();
       return data.data.token;
   } catch (error: any) {
       console.error('HeyGen Token Error:', error);
       throw error;
   }
}
