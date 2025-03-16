const express = require('express');

const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('admin')
const { isUndefined, isNotValidInteger, isNotValidString, isNotValidUrl, isNotValidImg } = require('../utils/validate');
const { appError, handleErrorAsync } = require('../utils/handleError');
const isAuth = require('../middlewares/isAuth');
const isCoach = require('../middlewares/isCoach');


const router = express.Router();
const userRepo = dataSource.getRepository('User');
const coachRepo = dataSource.getRepository('Coach');
const courseRepo = dataSource.getRepository('Course');

//修改課程
router.put('/coaches/courses/:courseId', isAuth, isCoach, handleErrorAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const { skill_id, name, description, start_at, end_at, max_participants, meeting_url } = req.body;

  if (isUndefined(skill_id) || isNotValidString(skill_id) || isUndefined(name) || isNotValidString(name) || isUndefined(description) || isNotValidString(description) || isUndefined(start_at) || isNotValidString(start_at) || isUndefined(end_at) || isNotValidString(end_at) || isUndefined(max_participants) || isNotValidInteger(max_participants) || isUndefined(meeting_url) || isNotValidUrl(meeting_url)) {
    return next(appError(400, '欄位未填寫正確'));
  }

  const findCourse = await courseRepo.findOne({
    where: {
      id: courseId
    }
  })

  if (!findCourse) {
    return next(appError(400, '課程不存在'));
  }

  const courseUpdataResult = await courseRepo.update(
    {
      id: courseId
    },
    {
      skill_id,
      name,
      description,
      start_at,
      end_at,
      meeting_url,
      max_participants
    }
  )

  if (courseUpdataResult.affected === 0) {
    return next(appError(400, '更新課程失敗'));
  }

  const courseResult = await courseRepo.findOne({
    where: {
      id: courseId
    }
  });

  res.status(201).json({
    status: 'success',
    data: {
      course: courseResult
    }
  })
}))

//新增課程
router.post('/coaches/courses', isAuth, isCoach, handleErrorAsync(async (req, res, next) => {
  const { user_id, skill_id, name, description, start_at, end_at, max_participants, meeting_url } = req.body;

  if (isUndefined(user_id) || isNotValidString(user_id) || isUndefined(skill_id) || isNotValidString(skill_id) || isUndefined(name) || isNotValidString(name) || isUndefined(description) || isNotValidString(description) || isUndefined(start_at) || isNotValidString(start_at) || isUndefined(end_at) || isNotValidString(end_at) || isUndefined(max_participants) || isNotValidInteger(max_participants) || isUndefined(meeting_url) || isNotValidUrl(meeting_url)) {
    return next(appError(400, '欄位未填寫正確'));
  }

  const findUser = await userRepo.findOne({
    where: {
      id: user_id
    }
  })

  if (!findUser) {
    return next(appError(400, '使用者不存在'));
  } else if (findUser.role !== "COACH") {
    return next(appError(400, '使用者尚未成為教練'));
  }

  const newCourse = courseRepo.create({
    user_id,
    skill_id,
    name,
    description,
    start_at,
    end_at,
    max_participants,
    meeting_url
  })

  const courseResult = await courseRepo.save(newCourse);

  res.status(201).json({
    status: 'success',
    data: {
      course: courseResult
    }
  })
}))



//註冊教練身份
router.post('/coaches/:userId', handleErrorAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { experience_years, description, profile_image_url } = req.body;

  if (isUndefined(experience_years) || isUndefined(description) || isNotValidInteger(experience_years) || isNotValidString(description) || (profile_image_url && isNotValidUrl(profile_image_url) && isNotValidImg(profile_image_url))) {
    return next(appError(400, '欄位未填寫正確'));
  }

  const findUser = await userRepo.findOne({
    where: {
      id: userId
    }
  })

  if (!findUser) {
    return next(appError(400, '使用者不存在'));
  } else if (findUser.role === 'COACH') {
    return next(appError(409, '使用者已經是教練'));
  }

  const updateToCoach = userRepo.update({
    id: userId
  }, {
    role: "COACH"
  })

  if ((await updateToCoach).affected === 0) {
    return next(appError(409, '更新使用者失敗'));
  }

  const newCoach = coachRepo.create({
    user_id: userId,
    experience_years,
    description,
    profile_image_url
  });
  const coachResult = await coachRepo.save(newCoach);
  const userResult = await userRepo.findOne({
    where: {
      id: userId
    }
  })

  res.status(200).json({
    status: 'success',
    data: {
      users: {
        name: userResult.name,
        role: userResult.role
      },
      coach: coachResult
    },
  })
}))




module.exports = router;