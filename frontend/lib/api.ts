const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const BASE_URL = 'http://localhost:5000/api'


export const api = {
  // GET /api/waiting-list
  getWaitingList: async (organ?: string) => {
    // keeping mock for waiting list for now as per plan focus on registration/alloction
    await delay(800)
    const mockData = [
      {
        id: "1",
        patientHash: "0x7a...4e1f",
        urgencyScore: 92,
        organ: "LIVER",
        status: "WAITING",
        timestamp: "2025-10-24 10:00",
      },
      {
        id: "2",
        patientHash: "0x2c...8b3d",
        urgencyScore: 88,
        organ: "HEART",
        status: "WAITING",
        timestamp: "2025-10-24 09:30",
      },
      {
        id: "3",
        patientHash: "0xf4...1a9e",
        urgencyScore: 85,
        organ: "KIDNEY",
        status: "WAITING",
        timestamp: "2025-10-24 08:45",
      },
    ]
    if (organ && organ !== "ALL") {
      return mockData.filter((r) => r.organ === organ)
    }
    return mockData
  },

  // POST /api/recipients
  registerRecipient: async (data: any) => {
    const res = await fetch('http://localhost:5000/api/recipients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to register recipient');
    return res.json();
  },

  // POST /api/donors
  registerDonor: async (data: any) => {
    const res = await fetch('http://localhost:5000/api/donors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to register donor');
    return res.json();
  },

  // POST /api/allocate
  allocate: async () => {
    const res = await fetch('http://localhost:5000/api/allocation/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to trigger allocation');
    return res.json();
  },

  // GET /api/history
  getHistory: async () => {
    await delay(1000)
    return [
      {
        id: "1",
        organ: "LIVER",
        patientHash: "0x7a...4e1f",
        urgencyScore: 92,
        date: "2025-10-24 14:30",
        txHash: "0xf9b2...c3d1",
        shap: [
          { name: "Bilirubin", value: 35 },
          { name: "Age", value: 12 },
          { name: "INR", value: 25 },
          { name: "Blood Match", value: 10 },
        ],
      },
    ]
  },

  // NEW: Find Top 3 Donors for a Recipient
  async findTopDonors(recipientId: string) {
    const response = await fetch(`${BASE_URL}/matches/find-top-donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to find top donors');
    }

    return response.json();
  },

  // NEW: Doctor Approves a Match
  async approveMatch(recipientId: string, donorId: string, doctorId: string, remarks?: string) {
    const response = await fetch(`${BASE_URL}/matches/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId, donorId, doctorId, remarks })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to approve match');
    }

    return response.json();
  },
}
