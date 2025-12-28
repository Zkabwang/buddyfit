"use client";

import Link from "next/link";
import { SignInButton,SignUpButton , UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, UserIcon, ZapIcon } from "lucide-react";
import { Button } from "./ui/button";


function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/60 py-3 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="p-1 rounded bg-primary/10">
            <ZapIcon className="h-4 w-4 text-primary" />
          </span>
          <span className="font-mono text-xl font-bold">
            Buddy<span className="text-primary">fit</span>.ai
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          {isSignedIn ? (
            <>
              <Link href="/" className="flex items-center gap-1.5 transition-colors hover:text-primary">
                <HomeIcon size={16} />
                <span>Home</span>
              </Link>

              <Link
                href="/generate-program"
                className="flex items-center gap-1.5 transition-colors hover:text-primary"
              >
                <DumbbellIcon size={16} />
                <span>Generate</span>
              </Link>

              <Link href="/profile" className="flex items-center gap-1.5 transition-colors hover:text-primary">
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>

              <Button
                asChild
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 hover:text-white hover:bg-primary/10"
              >
                <Link href="/generate-program">Get Started</Link>
              </Button>
              <UserButton />
            </>
          ) : (

            <>
             <SignInButton>
                <Button variant={"outline"}
                className="">Sign In</Button>

            </SignInButton> 

            <SignUpButton >
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Sign Up</Button>
            </SignUpButton>


            </>
           
            
          
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
