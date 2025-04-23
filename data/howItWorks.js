import { Settings, LineChart, Brain, FileText } from "lucide-react";

export const howItWorks = [
  {
    title: "Define Policy Parameters",
    description: "Set up your policy scenario by adjusting tax rates, emissions caps, and subsidies.",
    icon: <Settings className="h-8 w-8 text-primary" />,
  },
  {
    title: "Run Simulations",
    description: "Let our AI analyze the potential impacts across multiple timeframes and scenarios.",
    icon: <LineChart className="h-8 w-8 text-primary" />,
  },
  {
    title: "AI Analysis",
    description: "Get detailed forecasts of economic, environmental, and social impacts using Gemini API.",
    icon: <Brain className="h-8 w-8 text-primary" />,
  },
  {
    title: "Generate Reports",
    description: "Export comprehensive reports with visualizations and recommendations.",
    icon: <FileText className="h-8 w-8 text-primary" />,
  },
];