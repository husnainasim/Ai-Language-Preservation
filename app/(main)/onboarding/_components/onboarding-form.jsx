"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { onboardingSchema } from "@/app/lib/schema";
import { updateUser } from "@/actions/user";
import useFetch from "@/hooks/use-fetch";



const OnboardingForm = ({ languages }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      // name: "",
      // bio: "",
      // nativeLanguage: "",
      // preferredLanguages: [],
      // learningGoals: "",
      // timeZone: "",
      // role: "",
      // expertiseLevel: "",
      // communityInvolvement: "",
    },
  });

// This hook handles the user update API call
// - loading: boolean indicating if update is in progress
// - fn: function to call the updateUser API
// - data: response data from successful update

const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  // This effect runs when the update operation completes
  // - Checks if the update was successful and is no longer loading
  // - Shows a success toast notification
  // - Redirects user to dashboard
  // - Refreshes the router to ensure latest data is displayed
useEffect(() => {
  if (updateResult?.success && !updateLoading) {
    toast.success("Profile updated successfully!");
    router.push("/dashboard");
    router.refresh();
  }
}, [updateResult, updateLoading]);


  // async function onSubmit(values) {
  //   try {
  //     setIsLoading(true);
  //     await updateUser(values);
  //     toast.success("Profile updated successfully!");
  //     router.push("/dashboard");
  //   } catch (error) {
  //     toast.error("Failed to update profile");
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const onSubmit = async (values) => {
    console.log(values);
    
    try {
      const formattedLanguage = `${values.nativeLanguage}-${values.subdialect
        .toLowerCase()
        .replace(/ /g, "-")}`;
      await updateUserFn({
        ...values,
        nativeLanguage: formattedLanguage,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  const watchLanguage = watch("nativeLanguage");

  // const languageOptions = useMemo(
  //   () =>
  //     languages.map((language) => (
  //       <SelectItem key={language.id} value={language.id}>
  //         {language.name}
  //       </SelectItem>
  //     )),
  //   [languages]
  // );


  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Join the Language Revitalization Community
          </CardTitle>
          <CardDescription>
            Help preserve endangered languages by sharing your knowledge or
            learning from others
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <Form> */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* -----------------------------------  Role---------------------------------- */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                onValueChange={(value) => {
                  setValue("role", value);
                }}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LINGUIST">Community Linguist</SelectItem>
                  <SelectItem value="LEARNER">Language Learner</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
            {/* --------------------------------------name ------------------------------- */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* -----------------------------------  Bio     ---------------------------------- */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your interest in language preservation"
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>
            {/* -----------------------------------  Native Language---------------------------------- */}

            <div className="space-y-2">
              <Label htmlFor="nativeLanguage">Native Language</Label>
              <Select
                onValueChange={(value) => {
                  setValue("nativeLanguage", value);
                  setSelectedLanguage(
                    languages.find(
                      (nativeLanguage) => nativeLanguage.id === value
                    )
                  );
                  setValue("subdialect", "");
                }}
              >
                <SelectTrigger id="nativeLanguage">
                  <SelectValue placeholder="Select your native language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((nativeLanguage) => (
                    <SelectItem
                      key={nativeLanguage.id}
                      value={nativeLanguage.id}
                    >
                      {nativeLanguage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nativeLanguage && (
                <p className="text-sm text-red-500">
                  {errors.nativeLanguage.message}
                </p>
              )}
            </div>
            {/* -----------------------------------  Sub-Dialect---------------------------------- */}

            {watchLanguage && (
              <div className="space-y-2">
                <Label htmlFor="subdialect">Sub-Dialect</Label>

                <Select
                  onValueChange={(value) => {
                    setValue("subdialect", value);
                  }}
                >
                  <SelectTrigger id="subdialect">
                    <SelectValue placeholder="Select sub-dialect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>SubDialect</SelectLabel>
                      {selectedLanguage?.subDialects.map((subdialect) => (
                        <SelectItem key={subdialect} value={subdialect}>
                          {subdialect}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.subdialect && (
                  <p className="text-sm text-red-500">
                    {errors.subdialect.message}
                  </p>
                )}
              </div>
            )}

            {/* -----------------------------------  Languages to Learn/Teach---------------------------------- */}
            <div className="space-y-2">
              <Label htmlFor="preferredLanguages">
                Languages to Learn/Teach
              </Label>

              <Select
                onValueChange={(value) => {
                  setValue("preferredLanguages", value);
                }}
              >
                <SelectTrigger id="preferredLanguages">
                  <SelectValue placeholder="Select languages" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((preferredLanguages) => (
                    <SelectItem
                      key={preferredLanguages.id}
                      value={preferredLanguages.id}
                    >
                      {preferredLanguages.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.preferredLanguages && (
                <p className="text-sm text-red-500">
                  {errors.preferredLanguages.message}
                </p>
              )}
            </div>

            {/* --------------------------------------expertiseLevel------------------------------- */}
            <div className="space-y-2">
              <Label htmlFor="expertiseLevel">Expertise Level</Label>
              <Select
                onValueChange={(value) => {
                  setValue("expertiseLevel", value);
                }}
              >
                <SelectTrigger id="expertiseLevel">
                  <SelectValue placeholder="Select your expertise level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                  <SelectItem value="NATIVE">Native Speaker</SelectItem>
                </SelectContent>
              </Select>
              {errors.expertiseLevel && (
                <p className="text-sm text-red-500">
                  {errors.expertiseLevel.message}
                </p>
              )}
            </div>

            {/* --------------------------------------learning goals------------------------------- */}
            <div className="space-y-2">
              <Label htmlFor="learningGoals">Learning/Teaching Goals</Label>
              <Textarea
                id="learningGoals"
                placeholder="Describe your goals for language learning or teaching"
                {...register("learningGoals")}
              />
              {errors.learningGoals && (
                <p classlearningGoals="text-sm text-red-500">
                  {errors.learningGoals.message}
                </p>
              )}
            </div>
            {/* --------------------------------------timezone ------------------------------- */}
            <div className="space-y-2">
              <Label htmlFor="timeZone">Time Zone</Label>
              <Select
                onValueChange={(value) => {
                  setValue("timeZone", value);
                }}
              >
                <SelectTrigger id="timeZone">
                  <SelectValue placeholder="Select your time zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="EST">Eastern Time</SelectItem>
                  <SelectItem value="PST">Pacific Time</SelectItem>
                  <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                  <SelectItem value="CET">Central European Time</SelectItem>
                </SelectContent>
              </Select>
              {errors.timeZone && (
                <p className="text-sm text-red-500">
                  {errors.timeZone.message}
                </p>
              )}
            </div>
 <Button type="submit" className="w-full" disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
            {/* --------------------------------------availability ------------------------------- */}
          </form>
          {/* </Form> */}

          {/* <div className="mt-6">
            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full"
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button> */}
          {/* </div> */}
        </CardContent>
      </Card>
    </div>
    // <Card className="w-full max-w-2xl mx-auto">
    //   <CardHeader>
    //     <CardTitle className="text-2xl">
    //       Join the Language Revitalization Community
    //     </CardTitle>
    //     <CardDescription>
    //       Help preserve endangered languages by sharing your knowledge or
    //       learning from others
    //     </CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //         <FormField
    //           control={form.control}
    //           name="role"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Role</FormLabel>
    //               <Select
    //                 onValueChange={field.onChange}
    //                 defaultValue={field.value}
    //               >
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select your role" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   <SelectItem value="LINGUIST">
    //                     Community Linguist
    //                   </SelectItem>
    //                   <SelectItem value="LEARNER">Language Learner</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="name"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Name</FormLabel>
    //               <FormControl>
    //                 <Input placeholder="Enter your name" {...field} />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="bio"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Bio</FormLabel>
    //               <FormControl>
    //                 <Textarea
    //                   placeholder="Tell us about your interest in language preservation"
    //                   className="resize-none"
    //                   {...field}
    //                 />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="nativeLanguage"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Native Language</FormLabel>
    //               <Select
    //                 onValueChange={field.onChange}
    //                 defaultValue={field.value}
    //               >
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select your native language" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   {languages.map((language) => (
    //                     <SelectItem key={language.id} value={language.id}>
    //                       {language.name}
    //                     </SelectItem>
    //                   ))}
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="preferredLanguages"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Languages to Learn/Teach</FormLabel>
    //               <Select
    //                 onValueChange={(value) => {
    //                   const current = field.value || [];
    //                   if (!current.includes(value)) {
    //                     field.onChange([...current, value]);
    //                   }
    //                 }}
    //                 defaultValue={field.value?.[0]}
    //               >
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select languages" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   {languages.map((language) => (
    //                     <SelectItem key={language.id} value={language.id}>
    //                       {language.name}
    //                     </SelectItem>
    //                   ))}
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="expertiseLevel"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Expertise Level</FormLabel>
    //               <Select
    //                 onValueChange={field.onChange}
    //                 defaultValue={field.value}
    //               >
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select your expertise level" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   <SelectItem value="BEGINNER">Beginner</SelectItem>
    //                   <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
    //                   <SelectItem value="ADVANCED">Advanced</SelectItem>
    //                   <SelectItem value="NATIVE">Native Speaker</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="learningGoals"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Learning/Teaching Goals</FormLabel>
    //               <FormControl>
    //                 <Textarea
    //                   placeholder="Describe your goals for language learning or teaching"
    //                   className="resize-none"
    //                   {...field}
    //                 />
    //               </FormControl>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="timeZone"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Time Zone</FormLabel>
    //               <Select
    //                 onValueChange={field.onChange}
    //                 defaultValue={field.value}
    //               >
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select your time zone" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   <SelectItem value="UTC">UTC</SelectItem>
    //                   <SelectItem value="EST">Eastern Time</SelectItem>
    //                   <SelectItem value="PST">Pacific Time</SelectItem>
    //                   <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
    //                   <SelectItem value="CET">Central European Time</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <Button type="submit" disabled={isLoading}>
    //           {isLoading ? (
    //             <>
    //               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    //               Saving...
    //             </>
    //           ) : (
    //             "Complete Profile"
    //           )}
    //         </Button>
    //       </form>
    //     </Form>
    //   </CardContent>
    // </Card>
  );
};

export default OnboardingForm;
