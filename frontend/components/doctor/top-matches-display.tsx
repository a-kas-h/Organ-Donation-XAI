"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Heart, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"

interface DonorMatch {
    donorId: string
    donor: {
        donorId: string
        age: number
        weight: number
        BMI: number
        bloodType: string
        organDonated: string
        organHealthScore: number
        organCondition: string
    }
    predictedScore: number
    riskLevel: string
}

interface TopMatchesDisplayProps {
    matches: DonorMatch[]
    recipientId: string
    onApprovalSuccess: () => void
}

export function TopMatchesDisplay({ matches, recipientId, onApprovalSuccess }: TopMatchesDisplayProps) {
    const [approvingDonorId, setApprovingDonorId] = useState<string | null>(null)
    const [remarks, setRemarks] = useState("")
    const { toast } = useToast()

    const handleApprove = async (donorId: string) => {
        try {
            setApprovingDonorId(donorId)

            await api.approveMatch(
                recipientId,
                donorId,
                'DR-SYSTEM', // You can add doctor ID input field if needed
                remarks || `Approved best match from Top 3 selection`
            )

            toast({
                title: "Match Approved!",
                description: `Donor ${donorId} has been successfully matched with recipient ${recipientId}`,
            })

            onApprovalSuccess()

        } catch (error: any) {
            toast({
                title: "Approval Failed",
                description: error.message || "Failed to approve match",
                variant: "destructive"
            })
        } finally {
            setApprovingDonorId(null)
        }
    }

    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'LOW': return 'bg-green-500'
            case 'MODERATE': return 'bg-yellow-500'
            case 'HIGH': return 'bg-red-500'
            default: return 'bg-gray-500'
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    if (matches.length === 0) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="text-center text-muted-foreground">
                        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No compatible donor matches found</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Top {matches.length} Donor Matches</h3>
                <Badge variant="outline">Ranked by ML Prediction Score</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matches.map((match, index) => (
                    <Card
                        key={match.donorId}
                        className={`relative ${index === 0 ? 'border-2 border-primary' : ''}`}
                    >
                        {index === 0 && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-primary">Best Match</Badge>
                            </div>
                        )}

                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    Rank #{index + 1}
                                </span>
                                <Badge className={getRiskColor(match.riskLevel)}>
                                    {match.riskLevel}
                                </Badge>
                            </CardTitle>
                            <CardDescription>{match.donorId}</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* ML Predicted Score - Most Prominent */}
                            <div className="p-4 bg-muted rounded-lg text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <TrendingUp className="h-4 w-4" />
                                    <span className="text-sm font-medium text-muted-foreground">
                                        ML Predicted Score
                                    </span>
                                </div>
                                <div className={`text-4xl font-bold ${getScoreColor(match.predictedScore)}`}>
                                    {match.predictedScore.toFixed(1)}%
                                </div>
                            </div>

                            {/* Donor Details */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Age:</span>
                                    <span className="font-medium">{match.donor.age} years</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Weight:</span>
                                    <span className="font-medium">{match.donor.weight} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">BMI:</span>
                                    <span className="font-medium">{match.donor.BMI.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Blood Type:</span>
                                    <span className="font-medium">{match.donor.bloodType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Organ Health:</span>
                                    <span className="font-medium">{match.donor.organHealthScore}/100</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Organ:</span>
                                    <span className="font-medium">{match.donor.organDonated}</span>
                                </div>
                            </div>

                            {/* Approval Button */}
                            <Button
                                onClick={() => handleApprove(match.donorId)}
                                disabled={approvingDonorId !== null}
                                className="w-full"
                                variant={index === 0 ? "default" : "outline"}
                            >
                                {approvingDonorId === match.donorId ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Approve Match
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Doctor Remarks */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Doctor Remarks (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Add any remarks or notes about the match selection..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        rows={3}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
