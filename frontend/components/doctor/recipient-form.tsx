"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BrainCircuit, Activity, BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { api } from "@/lib/api";

const baseSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  organType: z.enum(["LIVER", "HEART", "KIDNEY"]),
  age: z.coerce.number().min(0).max(120),
  bloodType: z.string(),
});

const liverSchema = baseSchema.extend({
  organType: z.literal("LIVER"),
  bilirubin: z.coerce.number().min(0),
  albumin: z.coerce.number().min(0),
  inr: z.coerce.number().min(0),
  ascites: z.enum(["NONE", "MILD", "SEVERE"]),
});

const heartSchema = baseSchema.extend({
  organType: z.literal("HEART"),
  cholesterol: z.coerce.number().min(0),
  bloodPressure: z.coerce.number().min(0),
  chestPainType: z.enum(["TYPICAL", "ATYPICAL", "NON_ANGINAL", "ASYMPTOMATIC"]),
});

const kidneySchema = baseSchema.extend({
  organType: z.literal("KIDNEY"),
  creatinine: z.coerce.number().min(0),
  hemoglobin: z.coerce.number().min(0),
  sodium: z.coerce.number().min(0),
});

const recipientSchema = z.discriminatedUnion("organType", [
  liverSchema,
  heartSchema,
  kidneySchema,
]);

type RecipientFormValues = z.infer<typeof recipientSchema>;

export function RecipientForm() {
  const { toast } = useToast();
  const [result, setResult] = useState<{ score: number; shap: any[] } | null>(
    null
  );

  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      fullName: "",
      organType: "LIVER",
      age: 45,
      bloodType: "A+",
      bilirubin: 1.2,
      albumin: 3.5,
      inr: 1.1,
      ascites: "NONE",
    } as any,
  });

  const organType = form.watch("organType");

  const mutation = useMutation({
    mutationFn: (data: RecipientFormValues) => api.registerRecipient(data),
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Registration Successful",
        description: "Patient urgency has been calculated by ML engine.",
      });
    },
  });

  function onSubmit(values: RecipientFormValues) {
    mutation.mutate(values);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card className="border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recipient Details
          </CardTitle>
          <CardDescription>
            Register a new patient for the organ transplant waiting list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        Patient Full Name (Masked for Blockchain)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
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
                      <FormLabel>Requested Organ</FormLabel>
                      <Select
                        onValueChange={(v) => field.onChange(v)}
                        defaultValue={field.value}
                      >
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
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {organType === "LIVER" && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                  <FormField
                    control={form.control}
                    name="bilirubin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bilirubin (mg/dL)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="albumin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Albumin (g/dL)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>INR</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ascites"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ascites</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NONE">None</SelectItem>
                            <SelectItem value="MILD">Mild</SelectItem>
                            <SelectItem value="SEVERE">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {organType === "HEART" && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                  <FormField
                    control={form.control}
                    name="cholesterol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cholesterol</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodPressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Pressure</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {organType === "KIDNEY" && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                  <FormField
                    control={form.control}
                    name="creatinine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Creatinine</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hemoglobin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hemoglobin</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating Urgency...
                  </>
                ) : (
                  "Calculate Priority & Register"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <>
            <Card className="animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-primary" />
                  SHAP Explanations
                </CardTitle>
                <CardDescription>
                  Feature contribution to the calculated urgency score.
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={result.shap}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-sm text-xs">
                              {`${payload[0].payload.name}: ${
                                (payload[0].value as number) > 0 ? "+" : ""
                              }${payload[0].value}`}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {result.shap.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.value > 0
                              ? "oklch(0.55 0.18 25)"
                              : "oklch(0.55 0.15 160)"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 pt-0">
                <div className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Text Summary
                </div>
                <p className="text-xs text-muted-foreground italic">
                  "High organ condition indicators and age factor contributed
                  most significantly to the increased urgency. Blood match
                  results had a moderate positive impact on the score."
                </p>
              </CardFooter>
            </Card>
          </>
        ) : (
          <div className="h-full flex items-center justify-center p-12 border-2 border-dashed rounded-lg opacity-50">
            <div className="text-center space-y-2">
              <BrainCircuit className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm">
                Submit patient details to view ML urgency analysis
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


