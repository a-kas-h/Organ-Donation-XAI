const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  // GET /api/waiting-list
  getWaitingList: async (organ?: string) => {
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
    await delay(1500)
    return {
      score: Math.floor(Math.random() * 40) + 50,
      shap: [
        { name: "Age", value: data.age > 60 ? 15 : -5 },
        { name: "Clinical Values", value: 25 },
        { name: "Blood Match", value: 10 },
        { name: "Organ Condition", value: 30 },
      ],
    }
  },

  // POST /api/donors
  registerDonor: async (data: any) => {
    await delay(1000)
    return { success: true, ...data }
  },

  // POST /api/allocate
  allocate: async () => {
    await delay(2000)
    return {
      id: "AL-" + Math.random().toString(36).substring(7),
      organ: "LIVER",
      recipientHash: "0x7a...4e1f",
      urgencyScore: 88,
      donorId: "DN-4921",
      txHash: "0xf9b2...c3d1",
      timestamp: new Date().toLocaleString(),
    }
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
}
