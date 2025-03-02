"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowLeft, Timer } from "lucide-react";
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
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(30),
  phone:  z.string()
  .regex(/^\d{10}$/, "Phone Number must be 10 digits"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be 6 digits and contain only numbers"),
});

export default function Register() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState({ name: "", phone: "" });
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));


      setUserData({ name: values.name, phone: values.phone });
      setStep("otp");

      setTimer(30);
      setCanResend(false);

      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${values.phone}`,
      });
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line
  const onOTPVerify = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully!",
      });
      setTimeout(() => {
        registerForm.reset();
        otpForm.reset();
        setStep("phone");
      }, 2000);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Resending OTP to:", userData.phone);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "OTP Resent",
        description: `A new verification code has been sent to ${userData.phone}`,
      });

      setTimer(300);
      setCanResend(false);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="glass p-8 rounded-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
            <p className="text-gray-600">
              Join WaHire and revolutionize your hiring process
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-destructive/50 text-destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

              {step === "phone" ? (
                <Form {...registerForm}>
                  <form
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Phone Number</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                +91
                              </span>
                              <Input
                                placeholder="Enter your phone number"
                                type="number"
                                {...field}
                                pattern="[0-9]*"
                                min={6000000000}
                                max = {9999999999}
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "").slice(0, 10); 
                                  }}
                                onKeyPress ={(e)=> {
                                     if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                                  }}
                                onKeyUp={(e) => {
                                  if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                  }
                                }}
                                className="rounded-r-md rounded-l-none"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                <Button
                  type="submit"
                  className="w-full py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending OTP..." : "Get Verification Code"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onOTPVerify)}
                className="space-y-6"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="font-medium">{userData.phone}</p>
                </div>

                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            {[...Array(6)].map((_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full py-6 rounded-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Verifying..." : "Verify & Register"}
                </Button>

                <div className="text-center mt-4">
                  {canResend ? (
                    <Button
                      variant="link"
                      className={"cursor-pointer text-black"}
                      onClick={handleResendOTP}
                    >
                      Resend OTP
                    </Button>
                  ) : (
                    <p className="text-gray-500 flex items-center justify-center">
                      <Timer className="mr-2 h-4 w-4" /> Resend in{" "}
                      {formatTime(timer)}
                    </p>
                  )}
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
