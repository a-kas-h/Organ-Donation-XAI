"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, UserPlus } from "lucide-react"
import { api } from "@/lib/api"

// Simplified schema focused on ML requirements
const recipientSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  patientId: z.string().min(2, "Patient ID is required"),
  age: z.coerce.number().min(0).max(120, "Age must be 0-120"),
  weight: z.coerce.number().min(1).max(300, "Weight must be 1-300 kg"),
  height: z.coerce.number().min(1).max(250, "Height must be 1-250 cm"),
  organType: z.enum(["LIVER", "HEART", "KIDNEY"]),
  bloodType: z.string(),
  biologicalMarkers: z.coerce.number().min(0).max(10, "Markers must be 0-10"),
  riskScore: z.coerce.number().min(0).max(100, "Risk score must be 0-100"),
})

export function RecipientForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof recipientSchema>>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      fullName: "",
      patientId: `PAT-${Math.floor(Math.random() * 10000)}`,
      age: 45,
      weight: 80,
      height: 170,
      organType: "KIDNEY",
      bloodType: "A+",
      biologicalMarkers: 0.5,
      riskScore: 50,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof recipientSchema>) => {
      const bmi = data.weight / ((data.height / 100) ** 2);

      const payload = {
        patientId: data.patientId,
        age: data.age,
        weight: data.weight,
        height: data.height,
        BMI: parseFloat(bmi.toFixed(2)),
        bloodType: data.bloodType,
        organRequired: data.organType,
        diagnosisResult: `Requires ${data.organType} transplant`,
        biologicalMarkers: data.biologicalMarkers,
        organStatus: "Waiting",
        riskScore: data.riskScore,
      };

      return api.registerRecipient(payload);
    },
    onSuccess: () => {
      toast({
        title: "Recipient Registered",
        description: "Recipient has been successfully registered and added to waiting list.",
      })
      form.reset({
        fullName: "",
        patientId: `PAT-${Math.floor(Math.random() * 10000)}`,
        age: 45,
        weight: 80,
        height: 170,
        organType: "KIDNEY",
        bloodType: "A+",
        biologicalMarkers: 0.5,
        riskScore: 50,
      })
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register recipient",
        variant: "destructive",
      })
    },
  })

  return (
    <Card className="border-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" />
          Register Recipient
        </CardTitle>
        <CardDescription>Register recipient with fields required for ML matching</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient ID</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organ Required</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LIVER">Liver</SelectItem>
                        <SelectItem value="HEART">Heart</SelectItem>
                        <SelectItem value="KIDNEY">Kidney</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (ML Required)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg) (ML Required)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>Used to calculate BMI (ML Required)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="biologicalMarkers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biological Markers (0-10) (ML Required)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormDescription>
                      Clinical biological marker values (e.g., creatinine,  bilirubin levels)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskScore"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Risk Score (0-100) (ML Required)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Patient risk assessment score based on medical history (higher = higher risk)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Recipient
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
