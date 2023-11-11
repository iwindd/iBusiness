import { getServerSession } from "@/libs/session"

export const getStoreStats = async () => {
  try {
    const session = await getServerSession();
    return {
      success: true,
      data: session
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}