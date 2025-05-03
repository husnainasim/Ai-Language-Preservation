const { BarLoader } = require("react-spinners");
const { Suspense } = require("react");
const { currentUser } = require("@clerk/nextjs/server");
const { db } = require("@/lib/prisma");

async function Layout({ children }) {
  const user = await currentUser();

  const dbUser = await db.user.findUnique({
    where: {
      clerkUserId: user?.id,
    },
  });

  const nativeLanguage = dbUser?.nativeLanguage?.split("-")[0] || "Not Set";
  

  return (
    <div className="px-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Language Insights: {nativeLanguage}
        </h1>
      </div>
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="gray" />}
      >
        {children}
      </Suspense>
    </div>
  );
}

module.exports = Layout;
