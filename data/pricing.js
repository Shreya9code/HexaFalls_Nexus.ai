import { Globe, Rocket, Star } from "lucide-react";

export const pricingPlans = [
    {
      title: "Free",
      price: "$0",
      features: [
        "Basic resume builder",
        "Limited interview prep",
        "Access to community forums",
      ],
      icon: <Star className="w-6 h-6 text-primary" />,
    },
    {
      title: "Pro",
      price: "$19/month",
      features: [
        "Advanced resume builder",
        "Unlimited interview prep",
        "AI-powered career coach",
        "Global job market insights",
      ],
      icon: <Rocket className="w-6 h-6 text-primary" />,
    },
    {
      title: "Enterprise",
      price: "Custom",
      features: [
        "Dedicated account manager",
        "Team collaboration tools",
        "Custom AI solutions",
        "Priority support",
      ],
      icon: <Globe className="w-6 h-6 text-primary" />,
    },
  ];