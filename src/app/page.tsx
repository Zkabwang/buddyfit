import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import TerminalOverlay from "@/components/TerminalOverlay";
import UserPrograms from "@/components/UserPrograms";


function Homepage() {
    return (
        <div className="flex min-h-screen flex-col overflow-hidden text-foreground">
            <section className="relative z-10 flex-grow py-24">
                <div className="container mx-auto px-4">
                    <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                        <div className="absolute -top-10 left-0 h-40 w-40 border-l-2 border-t-2 border-border" />

                        <div className="relative space-y-8 lg:col-span-7">
                            <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                                <div>
                                    <span className="text-foreground">Transform</span>
                                </div>
                                <div>
                                    <span className="text-primary">Your Fitness Journey</span>
                                </div>
                                <div className="pt-2">
                                    <span className="text-foreground">with AI-Powered Technology</span>
                                </div>
                                <div className="pt-2">
                                    <span className="text-foreground">Specially Crafted </span>
                                    <span className="text-primary">Workouts</span>
                                </div>
                            </h1>

                            <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50" />

                            <p className="w-2/3 text-xl text-muted-foreground">
                                Sign up to talk with your personal Buddy AI assistant to get started and personalize your workout routines with a special
                                fitness nutrition plan.
                            </p>

                            <div className="flex items-center gap-10 py-6 font-mono">
                                <div className="flex flex-col">
                                    <div className="text-2xl text-primary">1000+</div>
                                    <div className="text-xs uppercase tracking-wider">Active Buddies</div>
                                </div>
                                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                                <div className="flex flex-col">
                                    <div className="text-2xl text-primary">3 min</div>
                                    <div className="text-xs uppercase tracking-wider">Generation</div>
                                </div>
                                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                                <div className="flex flex-col">
                                    <div className="text-2xl text-primary">100%</div>
                                    <div className="text-xs uppercase tracking-wider">Customized</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
                                <Button size="lg" asChild className="bg-primary px-8 py-6 text-lg font-medium text-primary-foreground">
                                    <Link href="/generate-program" className="flex items-center font-mono">
                                        Build Your Program
                                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="relative lg:col-span-5">
                            <div className="pointer-events-none absolute -inset-4">
                                <div className="absolute top-0 left-0 h-16 w-16 border-l-2 border-t-2 border-border" />
                                <div className="absolute top-0 right-0 h-16 w-16 border-r-2 border-t-2 border-border" />
                                <div className="absolute bottom-0 left-0 h-16 w-16 border-b-2 border-l-2 border-border" />
                                <div className="absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-border" />
                            </div>

                            {/* IMAGE CONTAINER */}
                            <div className="relative mx-auto aspect-square max-w-lg">
                                <div className="bg-cyber-black relative overflow-hidden rounded-lg">
                                    <img src="/KiddAI.png" alt="AI fitness coach" className="size-full object-cover object-center" />

                                    {/* SCAN LINE */}
                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline" />

                                    {/* TARGET LINES */}
                                    <div className="absolute top-1/2 left-0 h-px w-1/4 bg-primary/50" />
                                    <div className="absolute top-1/2 right-0 h-px w-1/4 bg-primary/50" />
                                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />

                                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                                </div>
                                {/* TERMINAL OVERLAY */}
                                <TerminalOverlay />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <UserPrograms />

        </div>
    );
}

export default Homepage;
