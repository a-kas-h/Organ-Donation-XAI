const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const BASE_URL = 'http://localhost:5000/api'


export const api = {
  // GET /api/recipients/waiting
  getWaitingList: async (organ?: string) => {
    const params = new URLSearchParams()
    if (organ && organ !== "ALL") {
      params.set("organ", organ)
    }
    const url = `${BASE_URL}/recipients/waiting${params.toString() ? `?${params.toString()}` : ""}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error("Failed to load waiting list")
    }
    return res.json()
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

  // GET /api/allocation/history
  getHistory: async () => {
    const res = await fetch(`${BASE_URL}/allocation/history?limit=50`)
    if (!res.ok) {
      throw new Error("Failed to load allocation history")
    }
    return res.json()
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

  // GET /api/donors
  async getDonors() {
    const response = await fetch(`${BASE_URL}/donors`)
    if (!response.ok) {
      throw new Error("Failed to load donors")
    }
    return response.json()
  },

  // GET /api/stats/overview
  async getOverviewStats() {
    const response = await fetch(`${BASE_URL}/stats/overview`)
    if (!response.ok) {
      throw new Error("Failed to load overview stats")
    }
    return response.json()
  },
}
