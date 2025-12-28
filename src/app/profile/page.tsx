"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Activity,
  AppleIcon,
  CalendarIcon,
  DumbbellIcon,
  History,
  Sparkles,
} from "lucide-react";

const ProfilePage = () => {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const syncUser = useMutation(api.users.syncUser);
  const lastSyncedUserId = useRef<string | null>(null);

  const userId = user?.id;
  const userEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    (userId ? `${userId}@buddy.ai` : undefined);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!user || !userId) return;
    if (lastSyncedUserId.current === userId) return;

    const fullName =
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      "Buddy";

    const syncProfile = async () => {
      try {
        await syncUser({
          name: fullName,
          email: userEmail ?? `${userId}@buddy.ai`,
          image: user.imageUrl,
          clerkId: userId,
        });
        lastSyncedUserId.current = userId;
      } catch (error) {
        console.error("Failed to sync user profile", error);
        lastSyncedUserId.current = null;
      }
    };

    syncProfile();
  }, [user, userId, userEmail, syncUser]);

  const allPlans = useQuery(
    api.plans.getUserPlans,
    userId ? { userId } : "skip"
  );

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const plans = allPlans ?? [];
  const hasPlans = plans.length > 0;
  const activePlan =
    plans.find((plan) => plan.isActive) ?? (hasPlans ? plans[0] : undefined);

  useEffect(() => {
    if (!hasPlans) return;
    if (selectedPlanId && plans.some((plan) => plan._id === selectedPlanId)) {
      return;
    }
    if (activePlan) {
      setSelectedPlanId(activePlan._id);
    }
  }, [hasPlans, activePlan, plans, selectedPlanId]);

  const currentPlan =
    plans.find((plan) => plan._id === selectedPlanId) ?? activePlan;

  const planHistory = hasPlans
    ? plans.filter((plan) => plan._id !== currentPlan?._id)
    : [];

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "Just now";
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderLoadingCard = (label: string) => (
    <div className="relative backdrop-blur-sm border border-border rounded-lg p-8 text-center animate-pulse">
      <CornerElements />
      <p className="font-mono text-muted-foreground">{label}</p>
    </div>
  );

  if (!isLoaded || !isSignedIn || !user) {
    return (
      <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
        {renderLoadingCard("Preparing your profile...")}
      </section>
    );
  }

  const isLoadingPlans = userId ? allPlans === undefined : true;

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      <div className="space-y-10">
        <ProfileHeader user={user} />

        {isLoadingPlans ? (
          <div className="grid gap-6 md:grid-cols-2">
            {renderLoadingCard("Syncing your AI-generated programs...")}
            {renderLoadingCard("Crunching nutrition metrics...")}
          </div>
        ) : hasPlans && currentPlan ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative border border-border rounded-lg p-5 backdrop-blur-sm">
                <CornerElements />
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-mono text-muted-foreground">
                    TOTAL PROGRAMS
                  </span>
                </div>
                <p className="text-3xl font-bold">{plans.length}</p>
                <p className="text-sm text-muted-foreground">Generated with BuddyFit AI</p>
              </div>

              <div className="relative border border-border rounded-lg p-5 backdrop-blur-sm">
                <CornerElements />
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="h-4 w-4 text-secondary" />
                  <span className="text-xs font-mono text-muted-foreground">
                    WEEKLY LOAD
                  </span>
                </div>
                <p className="text-3xl font-bold">
                  {currentPlan.workoutPlan.schedule.length}d
                  <span className="text-base font-normal text-muted-foreground">/wk</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentPlan.workoutPlan.schedule.join(" · ")}
                </p>
              </div>

              <div className="relative border border-border rounded-lg p-5 backdrop-blur-sm">
                <CornerElements />
                <div className="flex items-center gap-3 mb-3">
                  <History className="h-4 w-4 text-primary" />
                  <span className="text-xs font-mono text-muted-foreground">
                    LAST UPDATED
                  </span>
                </div>
                <p className="text-3xl font-bold">
                  {formatTimestamp(currentPlan._creationTime)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Active plan: {currentPlan.name}
                </p>
              </div>
            </div>

            <div className="relative border border-border rounded-lg p-6 backdrop-blur-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CornerElements />
              <div>
                <p className="text-xs font-mono text-primary">Need a refresh?</p>
                <h3 className="text-2xl font-semibold text-foreground">
                  Generate a new personalized program
                </h3>
                <p className="text-sm text-muted-foreground">
                  BuddyFit AI factors sleep, training days, and nutrition goals in minutes.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/generate-program">Generate Program</Link>
                </Button>
                <Button variant="outline" onClick={() => setSelectedPlanId(activePlan?._id ?? null)}>
                  View Active Plan
                </Button>
              </div>
            </div>

            <div className="relative backdrop-blur-sm border border-border p-6">
              <CornerElements />
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold tracking-tight">
                  <span className="text-primary">Your</span>{" "}
                  <span className="text-foreground">Fitness Plans</span>
                </h2>
                <div className="font-mono text-xs text-muted-foreground">
                  TOTAL: {plans.length}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {plans.map((plan) => {
                  const isSelected = currentPlan && plan._id === currentPlan._id;
                  return (
                    <Button
                      key={plan._id}
                      onClick={() => setSelectedPlanId(plan._id)}
                      className={`text-foreground border hover:text-white ${
                        isSelected
                          ? "bg-primary/20 text-primary border-primary"
                          : "bg-transparent border-border hover:border-primary/50"
                      }`}
                    >
                      {plan.name}
                      {plan.isActive && (
                        <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">
                          ACTIVE
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>

            {currentPlan && (
              <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
                <CornerElements />

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div>
                    <p className="text-xs font-mono text-muted-foreground">Currently viewing</p>
                    <h3 className="text-lg font-bold">
                      PLAN: <span className="text-primary">{currentPlan.name}</span>
                    </h3>
                  </div>
                </div>

                <Tabs defaultValue="workout" className="w-full">
                  <TabsList className="mb-6 w-full grid grid-cols-2 bg-cyber-terminal-bg border">
                    <TabsTrigger
                      value="workout"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <DumbbellIcon className="mr-2 size-4" />
                      Workout Plan
                    </TabsTrigger>

                    <TabsTrigger
                      value="diet"
                      className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                    >
                      <AppleIcon className="mr-2 h-4 w-4" />
                      Diet Plan
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="workout">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        <span className="font-mono text-sm text-muted-foreground">
                          SCHEDULE: {currentPlan.workoutPlan.schedule.join(", ")}
                        </span>
                      </div>

                      <Accordion type="multiple" className="space-y-4">
                        {currentPlan.workoutPlan.exercises.map((exerciseDay, index) => (
                          <AccordionItem
                            key={index}
                            value={`${exerciseDay.day}-${index}`}
                            className="border rounded-lg overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                              <div className="flex justify-between w-full items-center">
                                <span className="text-primary">{exerciseDay.day}</span>
                                <div className="text-xs text-muted-foreground">
                                  {exerciseDay.routines.length} EXERCISES
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="pb-4 px-4">
                              <div className="space-y-3 mt-2">
                                {exerciseDay.routines.map((routine, routineIndex) => (
                                  <div
                                    key={`${exerciseDay.day}-${routineIndex}`}
                                    className="border border-border rounded p-3 bg-background/50"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-semibold text-foreground">
                                        {routine.name}
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                          {routine.sets} SETS
                                        </div>
                                        <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">
                                          {routine.reps} REPS
                                        </div>
                                      </div>
                                    </div>
                                    {routine.description && (
                                      <p className="text-sm text-muted-foreground mt-1">
                                        {routine.description}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </TabsContent>

                  <TabsContent value="diet">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-mono text-sm text-muted-foreground">
                          DAILY CALORIE TARGET
                        </span>
                        <div className="font-mono text-xl text-primary">
                          {currentPlan.dietPlan.dailyCalories} KCAL
                        </div>
                      </div>

                      <div className="h-px w-full bg-border my-4"></div>

                      <div className="space-y-4">
                        {currentPlan.dietPlan.meals.map((meal, index) => (
                          <div
                            key={index}
                            className="border border-border rounded-lg overflow-hidden p-4"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              <h4 className="font-mono text-primary">{meal.name}</h4>
                            </div>
                            <ul className="space-y-2">
                              {meal.foods.map((food, foodIndex) => (
                                <li
                                  key={foodIndex}
                                  className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                  <span className="text-xs text-primary font-mono">
                                    {String(foodIndex + 1).padStart(2, "0")}
                                  </span>
                                  {food}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <div className="relative border border-border rounded-lg p-6 backdrop-blur-sm">
              <CornerElements />
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> Plan History
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  Chronological log
                </span>
              </div>
              {planHistory.length > 0 ? (
                <div className="space-y-4">
                  {planHistory.map((plan) => (
                    <div
                      key={plan._id}
                      className="border border-border/60 rounded-lg p-4 bg-background/60"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{plan.name}</p>
                          <p className="text-xs font-mono text-muted-foreground">
                            {formatTimestamp(plan._creationTime)}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {plan.workoutPlan.schedule.join(" · ")}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPlanId(plan._id)}
                        >
                          Review plan
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your previous programs will appear here once you generate more workouts.
                </p>
              )}
            </div>
          </>
        ) : (
          <NoFitnessPlan />
        )}
      </div>
    </section>
  );
};

export default ProfilePage;