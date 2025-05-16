export async function sendAddFundsSms(phoneNumber: string, amount: string): Promise<any> {
    const res = await fetch('https://ziltmobileserver.onrender.com/api/send-add-funds-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, amount }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send SMS');
    return data;
  }
  
  export async function checkVerify(phoneNumber: string, code: string): Promise<any> {
    const res = await fetch('https://ziltmobileserver.onrender.com/api/check-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: phoneNumber, code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Verification failed');
    return data;
  }

  export async function addFundsApi(userId: string, amount: string, paymentMethod: string): Promise<any> {
    const res = await fetch('https://ziltmobileserver.onrender.com/api/add-funds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount, paymentMethod }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add funds');
    return data.transaction;
  }