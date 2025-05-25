import  { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";

export const getStats = async (req, res, next) => {
  try {
    // const totalSongs = await Song.countDocuments();
    // const totalUsers = await User.countDocuments();
    // const totalAlbums = await Album.countDocuments();

    const [totalSongs, totalAlbums, totalUsers, uniqueAritists]= await Promise.all([
      Song.countDocuments(),
      Album.countDocuments(),
      User.countDocuments(),

      Song.aggregate([
        {
          $unionWith: {
            coll: "albums",
            pipeline: [],
          }
        },
        {
          $group: {
            _id: "$artist"
          }
        },
        {
          $count: "uniqueArtists"
        }
      ]),
    ]);

    res.status(200).json({
      totalSongs,
      totalAlbums,
      totalUsers,
      // uniqueAritists: uniqueAritists[0]?.count || 0
    });

  } catch (error) {
    next(error);
  }
}