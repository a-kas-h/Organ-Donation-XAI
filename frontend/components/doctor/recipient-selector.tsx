"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, Search, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Recipient {
    patientId: string
    fullName?: string
    age: number
    bloodType: string
    organRequired: string
    organStatus: string
}

interface RecipientSelectorProps {
    onFindMatches: (recipientId: string, recipientData: any) => void
    isLoading: boolean
}

export function RecipientSelector({ onFindMatches, isLoading }: RecipientSelectorProps) {
    const [recipients, setRecipients] = useState<Recipient[]>([])
    const [selectedRecipient, setSelectedRecipient] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        fetchWaitingRecipients()
    }, [])

    const fetchWaitingRecipients = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/recipients')
            if (response.ok) {
                const data = await response.json()
                // Filter only waiting recipients
                const waiting = data.filter((r: Recipient) => r.organStatus === 'Waiting')
                setRecipients(waiting)
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load recipients",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleFindMatches = () => {
        const recipient = recipients.find(r => r.patientId === selectedRecipient)
        if (recipient) {
            onFindMatches(selectedRecipient, recipient)
        }
    }

    const selectedRecipientData = recipients.find(r => r.patientId === selectedRecipient)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Select Recipient
                </CardTitle>
                <CardDescription>
                    Choose a waiting recipient to find their top 3 compatible donors
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : recipients.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        No recipients in waiting list
                    </div>
                ) : (
                    <>
                        <Select
                            value={selectedRecipient}
                            onValueChange={setSelectedRecipient}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a recipient..." />
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

                        {selectedRecipientData && (
                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                <h4 className="font-semibold">Recipient Details:</h4>
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

                        <Button
                            onClick={handleFindMatches}
                            disabled={!selectedRecipient || isLoading}
                            className="w-full"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Finding Matches..." : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Find Top 3 Donor Matches
                                </>
                            )}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
