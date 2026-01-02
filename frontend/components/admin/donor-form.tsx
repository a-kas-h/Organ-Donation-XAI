"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, HeartHandshake } from "lucide-react"
import { api } from "@/lib/api"

// Simplified schema focused on ML requirements
const donorSchema = z.object({
  donorId: z.string().min(2, "Donor ID is required"),
  age: z.coerce.number().min(0).max(120, "Age must be 0-120"),
  weight: z.coerce.number().min(1).max(300, "Weight must be 1-300 kg"),
  height: z.coerce.number().min(1).max(250, "Height must be 1-250 cm"),
  organType: z.enum(["LIVER", "HEART", "KIDNEY"]),
  bloodType: z.string(),
  organHealthScore: z.coerce.number().min(0).max(100, "Score must be 0-100"),
})

export function DonorForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof donorSchema>>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      donorId: `DN-${Math.floor(Math.random() * 10000)}`,
      age: 35,
      weight: 75,
      height: 175,
      organType: "KIDNEY",
      bloodType: "O+",
      organHealthScore: 95,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof donorSchema>) => {
      const bmi = data.weight / ((data.height / 100) ** 2);
      const payload = {
        donorId: data.donorId,
        age: data.age,
        weight: data.weight,
        height: data.height,
        BMI: parseFloat(bmi.toFixed(2)),
        bloodType: data.bloodType,
        organDonated: data.organType,
        realTimeOrganHealthScore: data.organHealthScore,
        organConditionAlert: "None",
        medicalApproval: true
      };
      return api.registerDonor(payload);
    },
    onSuccess: () => {
      toast({
        title: "Donor Registered",
        description: "Donor has been successfully registered in the system.",
      })
      form.reset({
        donorId: `DN-${Math.floor(Math.random() * 10000)}`,
        age: 35,
        weight: 75,
        height: 175,
        organType: "KIDNEY",
        bloodType: "O+",
        organHealthScore: 95,
      })
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register donor",
        variant: "destructive",
      })
    },
  })

  return (
    <Card className="border-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-primary" />
          Register Donor
        </CardTitle>
        <CardDescription>Register donor with fields required for ML matching</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="donorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donor ID</FormLabel>
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
                    <FormLabel>Organ Type</FormLabel>
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
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donor Age (ML Required)</FormLabel>
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
                    <FormDescription>Used to calculate BMI</FormDescription>
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
                name="organHealthScore"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Organ Health Score (0-100) (ML Required)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Real-time organ health assessment score (higher = healthier organ)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Donor
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
