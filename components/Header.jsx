// "use client";
import React from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  BookOpen,
  Users,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { checkUser } from "@/lib/checkUser";
const Header = async () => {
  await checkUser();
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <Image
            src={"/logo.png"}
            alt="Sensai Logo"
            width={200}
            height={60}
            className="h-12 py-1 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex
                 items-center gap-2"
              >
                {/* Make sure the icon is being rendered correctly */}
                <LayoutDashboard className="h-4 w-4 text-blue-500" />
                <span className="hidden md:block ">Language Insights</span>
              </Button>
              {/* <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button> */}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>
                  {/* Make sure the icon is being rendered correctly */}
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">
                    <ChevronDown className="h-4 w-4" />
                    Language Tools
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link
                    href="/upload-language"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Upload Language Data
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-lesson-generator"
                    className="flex items-center gap-2"
                  >
                    <PenBox className="h-4 w-4" />
                    AI Lesson Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/lessons" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    My Lessons
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/community-practice"
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Community Practice
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/progress" className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Progress & Recommendations
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
