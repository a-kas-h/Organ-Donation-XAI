"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, HeartHandshake } from "lucide-react"
import { api } from "@/lib/api"

const donorSchema = z.object({
  donorId: z.string().min(2, "Donor ID is required"),
  organType: z.enum(["LIVER", "HEART", "KIDNEY"]),
  bloodType: z.string(),
  hospitalLocation: z.string(),
  preservationStart: z.string(),
})

export function DonorForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof donorSchema>>({
    resolver: zodResolver(donorSchema),
    defaultValues: {
      donorId: `DN-${Math.floor(Math.random() * 10000)}`,
      organType: "KIDNEY",
      bloodType: "O+",
      hospitalLocation: "Central General Hospital",
      preservationStart: new Date().toISOString().slice(0, 16),
    },
  })

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof donorSchema>) => api.registerDonor(data),
    onSuccess: () => {
      toast({
        title: "Donor Registered",
        description: "Organ has been added to the network and blockchain ledger.",
      })
      form.reset({
        donorId: `DN-${Math.floor(Math.random() * 10000)}`,
        organType: "KIDNEY",
        bloodType: "O+",
        hospitalLocation: "Central General Hospital",
        preservationStart: new Date().toISOString().slice(0, 16),
      })
    },
  })

  return (
    <Card className="border-primary/10 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-primary" />
          Register Donor Organ
        </CardTitle>
        <CardDescription>Add a newly available organ to the allocation network.</CardDescription>
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
                    <FormLabel>Donor ID (Anonymized)</FormLabel>
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
                name="hospitalLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Retrieval Hospital</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preservationStart"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Preservation Start Time (Cold Ischemia Start)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register Organ
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
