"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
  Book,
  GraduationCap,
  Languages,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights }) => {
  if (!insights) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <p className="text-lg text-gray-500">No language insights available.</p>
      </div>
    );
  }

  // Transform regional metrics data for the chart
  const regionalMetricsData = insights.regionalMetrics.map((metric) => ({
    region: metric.region,
    speakerCount: metric.speakerCount,
    avgAge: metric.avgAge,
    youthSpeakerPercentage: metric.youthSpeakerPercentage,
  }));

  const getLearningDifficultyColor = (difficulty) => {
    if (!difficulty) return "bg-gray-500";
    switch (difficulty.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getVitalityOutlookInfo = (outlook) => {
    if (!outlook) return { icon: LineChart, color: "text-gray-500" };
    switch (outlook.toLowerCase()) {
      case "improving":
        return { icon: TrendingUp, color: "text-green-500" };
      case "stable":
        return { icon: LineChart, color: "text-yellow-500" };
      case "declining":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  // Get the first vitality trend object since it's stored as an array
  // const vitalityTrend =
  //   Array.isArray(insights.vitalityTrends) && insights.vitalityTrends.length > 0
  //     ? insights.vitalityTrends[0]
  //     : {
  //         growthRate: 0,
  //         outlook: "Unknown",
  //         topThreats: [],
  //         recommendedActions: [],
  //       };

  const OutlookIcon = getVitalityOutlookInfo(insights.vitalityTrends.outlook).icon;
  const outlookColor = getVitalityOutlookInfo(insights.vitalityTrends.outlook).color;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    {
      addSuffix: true,
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Language Vitality
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.vitalityTrends.outlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>
        {/* ------------------------ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Language Growth
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.vitalityTrends.growthRate?.toFixed(1) || "0"}%
            </div>
            <Progress value={insights.vitalityTrends.growthRate} className="mt-2" />
          </CardContent>
        </Card>
        {/* ------------------------ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Difficulty Level
            </CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.learningDifficulty}
            </div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getLearningDifficultyColor(
                insights.learningDifficulty
              )}`}
            />
          </CardContent>
        </Card>
        {/* ------------------------ */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Threats</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.vitalityTrends.topThreats?.map((threat, index) => (
                <Badge key={threat} variant="secondary">
                  {threat}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Metrics Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Regional Distribution</CardTitle>
          <CardDescription>Speaker demographics across regions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalMetricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: {item.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="speakerCount"
                  fill="#94a3b8"
                  name="Speaker Count"
                />
                <Bar dataKey="avgAge" fill="#64748b" name="Average Age" />
                <Bar
                  dataKey="youthSpeakerPercentage"
                  fill="#475569"
                  name="Youth Speaker %"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Language Resources Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5 text-blue-500" />
              Available Learning Resources
            </CardTitle>
            <CardDescription>
              Tools and materials for language learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {insights.availableResources?.map((resource, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {getResourceIcon(resource)}
                  <div>
                    <p className="font-medium">{resource}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

 {/* Community Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-green-500" />
              Community Statistics
            </CardTitle>
            <CardDescription>
              Active learners and native speakers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Active Learners
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Currently studying the language
                  </p>
                </div>
                <div className="text-2xl font-bold">
                  {insights.activeLearnersCount.toLocaleString()}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Native Speakers
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Current population
                  </p>
                </div>
                <div className="text-2xl font-bold">
                  {insights.nativeSpeakersCount.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Key Language Trends
            </CardTitle>
            <CardDescription>
              Current trends in language usage and preservation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.vitalityTrends.topThreats?.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-purple-500" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-amber-500" />
              Learning Recommendations
            </CardTitle>
            <CardDescription>
              Suggested approaches for preservation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.vitalityTrends.recommendedActions?.map((action, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-amber-500" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Helper function to determine the appropriate icon for each resource type
const getResourceIcon = (resource) => {
  const resourceType = resource.toLowerCase();
  if (resourceType.includes("book") || resourceType.includes("text")) {
    return <Book className="h-4 w-4 text-blue-500" />;
  } else if (
    resourceType.includes("course") ||
    resourceType.includes("class")
  ) {
    return <GraduationCap className="h-4 w-4 text-green-500" />;
  } else if (resourceType.includes("audio") || resourceType.includes("video")) {
    return <Languages className="h-4 w-4 text-purple-500" />;
  } else {
    return <Brain className="h-4 w-4 text-gray-500" />;
  }
};

export default DashboardView;
