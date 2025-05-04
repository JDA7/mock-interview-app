"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormField from "./FormField";

const authSchema = (type: FormType) => {
    return z.object({
        name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6),
    });
};

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const formSchema = authSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (type === "sign-up") {
                toast.success("Account created successfully. Please sign in.");
                router.push("/sign-in");
            } else {
                toast.success("Signed in successfully");
                router.push("/");
            }
        } catch (error) {
            console.log(error);
            toast.error(`There was an error: ${error}`);
        }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="card-border lg:min-w-[566px]">
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-row gap-2 justify-center">
                    <Image src="/logo.svg" alt="Logo" width={32} height={32} />
                    <h2 className="text-primary-100">TechPrep.ai</h2>
                </div>
                <h3 className="text-center">Practice job interviews with AI</h3>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4 form"
                    >
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                label="Name"
                                placeholder="Your name"
                            />
                        )}
                        <FormField
                            control={form.control}
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="Your email address"
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                        />

                        <Button className="btn" type="submit">
                            {isSignIn ? "Sign In" : "Create an Account"}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn
                        ? "Don't have an account?"
                        : "Already have an account?"}
                    <Link
                        href={!isSignIn ? "/sign-in" : "/sign-up"}
                        className="font-bold text-user-primary ml-1"
                    >
                        {!isSignIn ? "Sign In" : "Sign Up"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
