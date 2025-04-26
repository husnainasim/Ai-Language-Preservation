// import { getIndustryInsights } from "@/actions/dashboard";
// import DashboardView from "./_component/dashboard-view";
import {
  getUserOnboardingStatus,
  getUserProgress,
  getUserMatches,
} from "@/actions/user";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  Calendar,
  Headphones,
  MessageCircle,
  ChevronRight,
  GraduationCap,
  BarChart,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  // const { isOnboarded } = await getUserOnboardingStatus();
  // const progress = await getUserProgress();
  // const { matches, matchedBy } = await getUserMatches();

  // // If not onboarded, redirect to onboarding page
  // if (!isOnboarded) {
  //   redirect("/onboarding");
  // }

  // // Calculate total community connections
  // const totalConnections = matches.length + matchedBy.length;

  // // Get active languages (languages user is currently learning/teaching)
  // const activeLanguages = progress?.map((p) => p.lesson.language.name) || [];

  return (
    <div>
    
    </div>
  //   <div className="space-y-8">
  // //     {/* Header Section */}
  // //     <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  // //       <div>
  // //         <h1 className="text-4xl font-bold">Language Learning Dashboard</h1>
  // //         <p className="text-muted-foreground">
  // //           Track your progress and continue your language learning journey
  // //         </p>
  // //       </div>
  // //       <Button className="w-full md:w-auto">
  // //         Start New Lesson
  // //         <ChevronRight className="ml-2 h-4 w-4" />
  // //       </Button>
  // //     </div>

  // //     {/* Stats Overview */}
  // //     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  // //       <Card>
  // //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  // //           <CardTitle className="text-sm font-medium">
  // //             Active Languages
  // //           </CardTitle>
  // //           <BookOpen className="h-4 w-4 text-muted-foreground" />
  // //         </CardHeader>
  // //         <CardContent>
  // //           <div className="text-2xl font-bold">{activeLanguages.length}</div>
  // //           <p className="text-xs text-muted-foreground">
  // //             Languages in progress
  // //           </p>
  // //         </CardContent>
  // //       </Card>

  // //       <Card>
  // //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  // //           <CardTitle className="text-sm font-medium">Community</CardTitle>
  // //           <Users className="h-4 w-4 text-muted-foreground" />
  // //         </CardHeader>
  // //         <CardContent>
  // //           <div className="text-2xl font-bold">{totalConnections}</div>
  // //           <p className="text-xs text-muted-foreground">
  // //             Learning connections
  // //           </p>
  // //         </CardContent>
  // //       </Card>

  // //       <Card>
  // //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  // //           <CardTitle className="text-sm font-medium">Study Time</CardTitle>
  // //           <Clock className="h-4 w-4 text-muted-foreground" />
  // //         </CardHeader>
  // //         <CardContent>
  // //           <div className="text-2xl font-bold">12.5h</div>
  // //           <p className="text-xs text-muted-foreground">This month</p>
  // //         </CardContent>
  // //       </Card>

  // //       <Card>
  // //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
  // //           <CardTitle className="text-sm font-medium">
  // //             Achievement Score
  // //           </CardTitle>
  // //           <GraduationCap className="h-4 w-4 text-muted-foreground" />
  // //         </CardHeader>
  // //         <CardContent>
  // //           <div className="text-2xl font-bold">850</div>
  // //           <p className="text-xs text-muted-foreground">Points earned</p>
  // //         </CardContent>
  // //       </Card>
  // //     </div>

  // //     {/* Main Content Grid */}
  // //     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
  // //       {/* Learning Progress */}
  // //       <Card className="lg:col-span-4">
  // //         <CardHeader>
  // //           <CardTitle>Learning Progress</CardTitle>
  // //         </CardHeader>
  // //         <CardContent>
  // //           {progress?.length > 0 ? (
  //             <div className="space-y-4">
  //               {progress.map((record) => (
  //                 <div key={record.id} className="space-y-2">
  //                   <div className="flex items-center justify-between">
  //                     <div className="flex items-center gap-2">
  //                       <span className="font-medium">
  //                         {record.lesson.language.name}
  //                       </span>
  //                       <Badge variant="outline">
  //                         Lesson {record.lesson.id}
  //                       </Badge>
  //                     </div>
  //                     <span className="text-sm text-muted-foreground">
  //                       {record.progress}%
  //                     </span>
  //                   </div>
  //                   <div className="h-2 w-full rounded-full bg-secondary">
  //                     <div
  //                       className="h-2 rounded-full bg-primary"
  //                       style={{ width: `${record.progress}%` }}
  //                     />
  //                   </div>
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <div className="flex flex-col items-center justify-center h-40 gap-4">
  //               <BarChart className="h-8 w-8 text-muted-foreground" />
  //               <p className="text-muted-foreground text-center">
  //                 Start learning to see your progress here
  //               </p>
  //               <Button>Begin Learning</Button>
  //             </div>
  //           )}
  //         </CardContent>
  //       </Card>

  //       {/* Community & Resources */}
  //       <Card className="lg:col-span-3">
  //         <CardHeader>
  //           <CardTitle>Quick Actions</CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="grid gap-4 grid-cols-1">
  //             <Link href="/practice">
  //               <Button variant="outline" className="w-full justify-start">
  //                 <Headphones className="mr-2 h-4 w-4" />
  //                 Practice Pronunciation
  //               </Button>
  //             </Link>

  //             <Link href="/community">
  //               <Button variant="outline" className="w-full justify-start">
  //                 <MessageCircle className="mr-2 h-4 w-4" />
  //                 Join Language Exchange
  //               </Button>
  //             </Link>

  //             <Link href="/schedule">
  //               <Button variant="outline" className="w-full justify-start">
  //                 <Calendar className="mr-2 h-4 w-4" />
  //                 Schedule Practice Session
  //               </Button>
  //             </Link>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>

  //     {/* Community Matches */}
  //     <Card>
  //       <CardHeader>
  //         <CardTitle>Recent Community Matches</CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  //           {matches.length > 0 ? (
  //             matches.slice(0, 3).map((match) => (
  //               <Card key={match.id}>
  //                 <CardContent className="pt-6">
  //                   <div className="flex items-center gap-4">
  //                     <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
  //                       <Users className="h-6 w-6" />
  //                     </div>
  //                     <div>
  //                       <p className="font-medium">{match.matchedUser.name}</p>
  //                       <p className="text-sm text-muted-foreground">
  //                         {match.matchReason || "Language Exchange Partner"}
  //                       </p>
  //                     </div>
  //                   </div>
  //                 </CardContent>
  //               </Card>
  //             ))
  //           ) : (
  //             <div className="col-span-full flex flex-col items-center justify-center h-40 gap-4">
  //               <Users className="h-8 w-8 text-muted-foreground" />
  //               <p className="text-muted-foreground text-center">
  //                 No community matches yet. Start connecting with other
  //                 learners!
  //               </p>
  //               <Button>Find Language Partners</Button>
  //             </div>
  //           )}
  //         </div>
  //       </CardContent>
  //     </Card>
    // </div>
  );
}
