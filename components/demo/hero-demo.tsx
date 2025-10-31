import { Hero } from "@/components/ui/hero"

function HeroDemo() {
  return (
    <Hero
      title="Restaurent Insights:SQL-Driven Analysis & ML Rating Prediction on Zomato NCR Data "
      subtitle={
        <>
          Exploring Restaurant Trends & Predicting Ratings with SQL and ML
          <br />
          by <span className="font-bold text-black dark:text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.6)] dark:drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"> Waqar Akhtar & Akshat Talwar</span>
        </>
      }
      actions={[
        {
          label: "Dashboard",
          href: "#",
          variant: "outline",
          size: "xl"
        },
        {
          label: "ML Model",
          href: "#",
          variant: "white",
          size: "xl"
        }
      ]}
      titleClassName="text-5xl md:text-6xl font-extrabold"
      subtitleClassName="text-lg md:text-xl max-w-[600px]"
      actionsClassName="mt-8"
    />
  )
}

export { HeroDemo }