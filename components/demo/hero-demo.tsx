import { Hero } from "@/components/ui/hero"

function HeroDemo() {
  return (
    <Hero
      title="Restaurant Insights: SQL-Driven Analysis & ML Rating Prediction on Zomato NCR Data"
      subtitle={
        <>
          Exploring Restaurant Trends & Predicting Ratings with SQL and ML
          <br />
          by <span className="font-bold text-black dark:text-white ]"> Waqar Akhtar & Akshat Talwar</span>
        </>
      }
      actions={[
        {
          label: "Dashboard",
          href: "/dashboard",
          variant: "outline",
          size: "xl"
        },
        {
          label: "ML Model",
          href: "https://ncr-zomato-rating-predictor.vercel.app/",
          variant: "default",
          size: "xl"
        }
      ]}
      titleClassName="text-5xl md:text-6xl font-extrabold"
      subtitleClassName="text-lg md:text-xl max-w-[600px]"
      actionsClassName="mt-9"
    />
  )
}

export { HeroDemo }