import { axiosInstance } from "@/lib/axios";

// Helper to fetch the internal MongoDB user _id by Clerk user id
export const getMongoUserId = async (clerkId: string): Promise<string | undefined> => {
  try {
    const res = await axiosInstance.get(`/users/by-clerk/${clerkId}`);
    return res.data?._id;
  } catch {
    return undefined;
  }
};
