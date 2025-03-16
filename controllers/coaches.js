const { dataSource } = require('../db/data-source');
const { isNotValidString, isUndefined, isNotValidInteger } = require('../utils/validate');
const { appError } = require('../utils/handleError');
const coachRepo = dataSource.getRepository('Coach');

const coachesController = {
  getCoaches: async (req, res, next) => {
    const { per, page } = req.query;
    if (isUndefined(per) || isUndefined(page) || isNotValidInteger(Number(per)) || isNotValidInteger(Number(page))) {
      return next(appError(400, '欄位未填寫正確'));
    }
    let take = Number(per);
    let skip = Number(per) * (Number(page) - 1);
    const coaches = await coachRepo.find({
      select: {
        id: true,
        User: {
          name: true
        }
      },
      take,
      skip,
      relations: {
        User: true
      }
    });

    res.status(200).json({
      status: 'success',
      data: coaches.map(coach => ({
        id: coach.id,
        name: coach.User.name
      }))
    })

  },
  getCoachById: async (req, res, next) => {
    const { coachId } = req.params;
    if (isNotValidString(coachId)) {
      return next(appError(400, '欄位未填寫正確'));
    }

    const findCoach = await coachRepo.findOne({
      select: {
        id: true,
        user_id: true,
        experience_years: true,
        description: true,
        profile_image_url: true,
        created_at: true,
        updated_at: true,
        User: {
          name: true,
          role: true
        }
      },
      where: {
        id: coachId
      },
      relations: {
        User: true
      }
    })

    if (!findCoach) {
      return next(appError(400, '找不到該教練'));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: {
          name: findCoach.User.name,
          role: findCoach.User.role
        },
        coach: {
          id: findCoach.id,
          user_id: findCoach.user_id,
          experience_years: findCoach.experience_years,
          description: findCoach.description,
          profile_image_url: findCoach.profile_image_url,
          created_at: findCoach.created_at,
          updated_at: findCoach.updated_at
        }
      }
    })
  }
}

module.exports = coachesController