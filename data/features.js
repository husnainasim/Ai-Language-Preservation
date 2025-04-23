import { Brain, LineChart, Database, FileText } from "lucide-react";

export const features = [
  {
    title: "AI-Powered Forecasting",
    description: "Leverage Gemini API for accurate predictions of policy impacts on GDP, emissions, and public sentiment.",
    icon: <Brain className="h-12 w-12 text-primary" />,
  },
  {
    title: "Interactive Dashboards",
    description: "Visualize policy impacts with dynamic charts, graphs, and sentiment clouds for better decision making.",
    icon: <LineChart className="h-12 w-12 text-primary" />,
  },
  {
    title: "Secure Data Storage",
    description: "Store and analyze simulation data securely with NeonDB and Prisma integration.",
    icon: <Database className="h-12 w-12 text-primary" />,
  },
  {
    title: "Export Reports",
    description: "Generate detailed PDF reports of your policy simulations and their projected impacts.",
    icon: <FileText className="h-12 w-12 text-primary" />,
  },
];