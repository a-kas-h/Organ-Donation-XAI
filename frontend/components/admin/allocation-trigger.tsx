"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Zap, CheckCircle, UserCheck, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface Recipient {
  patientId: string
  fullName?: string
  age: number
  bloodType: string
  organRequired: string
  organStatus: string
}

export function AllocationTrigger() {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [fetchingRecipients, setFetchingRecipients] = useState(true)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchWaitingRecipients()
  }, [])

  const fetchWaitingRecipients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recipients')
      if (response.ok) {
        const data = await response.json()
        const waiting = data.filter((r: Recipient) => r.organStatus === 'Waiting')
        setRecipients(waiting)
      }
    } catch (error) {
      console.error('Failed to load recipients:', error)
    } finally {
      setFetchingRecipients(false)
    }
  }

  const handleTriggerAllocation = async () => {
    if (!selectedRecipient) {
      toast({
        title: "No Recipient Selected",
        description: "Please select a recipient first",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      setResult(null)

      // Call the find-top-donors endpoint which now auto-stores in DB
      const response = await api.findTopDonors(selectedRecipient)

      setResult(response)

      if (response.topMatches && response.topMatches.length > 0) {
        toast({
          title: "Allocation Successful!",
          description: `Top ${response.matchesStored} matches stored in database for ${response.recipientId}`,
        })
      } else {
        toast({
          title: "No Matches Found",
          description: response.message || "No compatible donors available",
          variant: "destructive"
        })
      }

      // Refresh recipients list
      await fetchWaitingRecipients()
      setSelectedRecipient("")

    } catch (error: any) {
      toast({
        title: "Allocation Failed",
        description: error.message || "Failed to trigger allocation",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedRecipientData = recipients.find(r => r.patientId === selectedRecipient)

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Trigger Allocation
        </CardTitle>
        <CardDescription>
          Select a recipient to find and store their top 3 compatible donor matches
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fetchingRecipients ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : recipients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recipients in waiting list
          </div>
        ) : (
          <>
            {/* Recipient Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Recipient</label>
              <Select
                value={selectedRecipient}
                onValueChange={setSelectedRecipient}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a recipient..." />
                </SelectTrigger>
                <SelectContent>
                  {recipients.map((recipient) => (
                    <SelectItem key={recipient.patientId} value={recipient.patientId}>
                      {recipient.patientId} - {recipient.organRequired} ({recipient.bloodType})
                      {recipient.fullName && ` - ${recipient.fullName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Recipient Details */}
            {selectedRecipientData && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <UserCheck className="h-4 w-4" />
                  <h4 className="font-semibold">Selected Recipient:</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">ID:</span> {selectedRecipientData.patientId}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Age:</span> {selectedRecipientData.age}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Organ:</span> {selectedRecipientData.organRequired}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Blood:</span> {selectedRecipientData.bloodType}
                  </div>
                </div>
              </div>
            )}

            {/* Trigger Button */}
            <Button
              onClick={handleTriggerAllocation}
              disabled={!selectedRecipient || loading}
              className="w-full"
              size="lg"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Processing..." : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Trigger Allocation (Find Top 3 Matches)
                </>
              )}
            </Button>

            {/* Results Display */}
            {result && result.topMatches && result.topMatches.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Top {result.topMatches.length} Matches Stored
                  </h4>
                  <Badge variant="outline">{result.matchesStored} saved to DB</Badge>
                </div>

                {result.topMatches.map((match: any, index: number) => (
                  <div key={match.donorId} className="p-4 border rounded-lg bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          Rank #{index + 1}
                        </Badge>
                        <span className="font-medium">{match.donorId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-lg font-bold text-primary">
                          {match.predictedScore.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div>Age: {match.donor.age}</div>
                      <div>Blood: {match.donor.bloodType}</div>
                      <div>Health: {match.donor.organHealthScore}/100</div>
                    </div>
                  </div>
                ))}

                <p className="text-sm text-muted-foreground text-center">
                  ✅ Matches have been stored in the database with "Pending" status
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
