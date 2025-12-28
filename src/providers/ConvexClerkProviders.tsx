"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk as ConvexClerkBridge } from "convex/react-clerk";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

const convex = new ConvexReactClient(convexUrl);

type ConvexClerkProvidersProps = {
    children: ReactNode;
};

function ConvexClerkProviders({ children }: ConvexClerkProvidersProps) {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

    if (!publishableKey) {
        throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable");
    }

    return (
        <ClerkProvider publishableKey={publishableKey}>
            <ConvexClerkBridge client={convex} useAuth={useAuth}>
                {children}
            </ConvexClerkBridge>
        </ClerkProvider>
    );
}

export default ConvexClerkProviders;
