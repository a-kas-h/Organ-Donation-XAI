"use client"

import { useState } from "react"
import { RecipientSelector } from "@/components/doctor/recipient-selector"
import { TopMatchesDisplay } from "@/components/doctor/top-matches-display"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function FindMatchesPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [matches, setMatches] = useState<any>(null)
    const { toast } = useToast()

    const handleFindMatches = async (recipientId: string, recipientData: any) => {
        try {
            setIsLoading(true)
            setMatches(null)

            const result = await api.findTopDonors(recipientId)

            if (result.topMatches && result.topMatches.length > 0) {
                setMatches(result)
                toast({
                    title: "Matches Found!",
                    description: `Found ${result.topMatches.length} compatible donor(s) for ${recipientId}`,
                })
            } else {
                toast({
                    title: "No Matches",
                    description: result.message || "No compatible donors found for this recipient",
                    variant: "destructive"
                })
                setMatches({ topMatches: [], recipientId, ...result })
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to find matches",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprovalSuccess = () => {
        // Reset the view after successful approval
        setMatches(null)
        toast({
            title: "Success",
            description: "Recipient has been matched. They are no longer in the waiting list.",
        })
    }

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Find Donor Matches</h1>
                    <p className="text-muted-foreground mt-2">
                        Select a recipient to find their top 3 compatible donor matches
                    </p>
                </div>
                <Link href="/doctor-dashboard">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <RecipientSelector
                        onFindMatches={handleFindMatches}
                        isLoading={isLoading}
                    />
                </div>

                <div className="lg:col-span-2">
                    {matches ? (
                        <TopMatchesDisplay
                            matches={matches.topMatches || []}
                            recipientId={matches.recipientId}
                            onApprovalSuccess={handleApprovalSuccess}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full min-h-[400px] border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground text-center">
                                Select a recipient and click "Find Top 3 Donor Matches"<br />
                                to see compatible donors ranked by ML prediction score
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
