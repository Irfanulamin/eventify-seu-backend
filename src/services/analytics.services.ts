import User from "../models/user";
import Event from "../models/event";

export interface AnalyticsData {
  ClubsActivity: Array<{ name: string; value: number; displayName: string }>;
  MostLikeClub: Array<{ name: string; value: number; displayName: string }>;
  Users: {
    students: number;
    users: number;
    admins: number;
    super_admins: number;
  };
}

export class AnalyticsService {
  async getAnalytics(): Promise<AnalyticsData> {
    const [clubsActivity, mostLikedClubs, userCounts] = await Promise.all([
      this.getClubsActivity(),
      this.getMostLikedClubs(),
      this.getUserCounts(),
    ]);

    return {
      ClubsActivity: clubsActivity,
      MostLikeClub: mostLikedClubs,
      Users: userCounts,
    };
  }

  private async getClubsActivity(): Promise<
    Array<{ name: string; value: number; displayName: string }>
  > {
    const clubsActivity = await Event.aggregate([
      {
        $group: {
          _id: "$club",
          eventCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "clubs",
          localField: "_id",
          foreignField: "_id",
          as: "club",
        },
      },
      {
        $unwind: "$club",
      },
      {
        $project: {
          name: {
            $replaceAll: {
              input: { $toLower: "$club.name" },
              find: " ",
              replacement: "_",
            },
          },
          value: "$eventCount",
          displayName: "$club.name",
        },
      },
      {
        $sort: { value: -1 },
      },
    ]);

    return clubsActivity;
  }

  private async getMostLikedClubs(): Promise<
    Array<{ name: string; value: number; displayName: string }>
  > {
    const clubEventCounts = await Event.aggregate([
      {
        $group: {
          _id: "$club",
          eventCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "clubs",
          localField: "_id",
          foreignField: "_id",
          as: "club",
        },
      },
      { $unwind: "$club" },
      {
        $project: {
          name: {
            $replaceAll: {
              input: { $toLower: "$club.name" },
              find: " ",
              replacement: "_",
            },
          },
          displayName: "$club.name",
          value: { $round: [{ $multiply: ["$eventCount", 0.7] }, 0] },
        },
      },
      { $sort: { value: -1 } },
    ]);

    return clubEventCounts;
  }

  private async getUserCounts(): Promise<{
    students: number;
    users: number;
    admins: number;
    super_admins: number;
  }> {
    const userCounts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      students: 0,
      users: 0,
      admins: 0,
      super_admins: 0,
    };

    userCounts.forEach(({ _id, count }) => {
      if (_id === "user") {
        counts.users = count;
        counts.students = count;
      } else if (_id === "admin") {
        counts.admins = count;
      } else if (_id === "super-admin") {
        counts.super_admins = count;
      }
    });

    return counts;
  }
}
