// ここに認証に関するAPIを書いていきます

const router = require("express").Router(); //ルーター分けるための記述
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated"); //認証用のミドルウェア

const prisma = new PrismaClient(); //PrismaClientのインスタンスを作成

router.get("/goals_get", isAuthenticated, async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: {
        authorId: req.userId,
      },
      orderBy: {
        deadLine: "asc",
      },
    });
    res.status(200).json(goals);
  } catch (e) {
    console.log(e);
    res.status(501).json({ message: "サーバーエラー" });
  }
});

router.post("/goals_post", isAuthenticated, async (req, res) => {
  const { content, deadLine, future } = req.body;

  //文字数を制限
  if (content.length > 50) {
    return res.status(400).json({ message: "50文字以内で入力してください" });
  }
  if (future.length > 300) {
    return res.status(400).json({ message: "300文字以内で入力してください" });
  }

  const goal = await prisma.goal.create({
    data: {
      content,
      deadLine: deadLine,
      authorId: req.userId,
      future: future,
    },
  });
  if (!goal) {
    return res.status(404).json({ message: "ユーザーが見つからない" });
  }
  res.status(201).json(goal); //201は作成成功
});

router.get("/goal_set/:goalId", isAuthenticated, async (req, res) => {
  const { goalId } = req.params; //パラメータを受け取る
  try {
    const userGoal = await prisma.goal.findUnique({
      where: {
        id: parseInt(goalId),
        authorId: req.userId,
      },
    });

    res.status(200).json(userGoal);
  } catch (e) {
    res.status(500).json({ error: "サーバーエラー" });
  }
});

router.put("/goal_update/:goalId", isAuthenticated, async (req, res) => {
  const { goalId } = req.params;
  const { content, deadLine, future } = req.body;

  try {
    //文字数を制限
    if (content.length > 50) {
      return res.status(400).json({ message: "50文字以内で入力してください" });
    }
    if (future.length > 300) {
      return res.status(400).json({ message: "300文字以内で入力してください" });
    }
    const goal = await prisma.goal.update({
      where: {
        id: parseInt(goalId),
        authorId: req.userId,
      },
      data: {
        content,
        deadLine: deadLine,
        future,
      },
    });
    res.status(200).json(goal);
  } catch (e) {
    res.status(500).json({ error: "サーバーエラー" });
  }
});

router.delete("/goal_delete/:goalId", isAuthenticated, async (req, res) => {
  try {
    delData = await prisma.goal.delete({
      where: {
        id: parseInt(req.params.goalId),
        authorId: req.userId,
      },
    });
    res.status(200).json(delData);
  } catch (e) {
    res.status(500).json({ error: "サーバーエラー" });
  }
});

router.post("/step_post/:goalId", isAuthenticated, async (req, res) => {
  const { goalId } = req.params;
  const { content, deadLine, reward } = req.body;

  //文字数を制限
  if (content.length > 50) {
    return res.status(400).json({ message: "50文字以内で入力してください" });
  }
  if (reward.length > 300) {
    return res.status(400).json({ message: "300文字以内で入力してください" });
  }

  const step = await prisma.steps.create({
    data: {
      content,
      deadLine: deadLine,
      clearTime: "1970-01-01T00:00:00.000Z",
      authorId: req.userId,
      reward: reward,
      goalId: parseInt(goalId),
    },
  });
  if (!step) {
    return res.status(404).json({ message: "ユーザーが見つからない" });
  }
  res.status(201).json(step); //201は作成成功
});

router.get("/steps_get/:goalId", isAuthenticated, async (req, res) => {
  try {
    const steps = await prisma.steps.findMany({
      where: {
        authorId: req.userId,
        goalId: parseInt(req.params.goalId),
      },
      orderBy: {
        deadLine: "asc",
      },
    });
    res.status(200).json(steps);
  } catch (e) {
    res.status(500).json({ message: "サーバーエラー" });
  }
});

router.put("/step_update/:stepId", isAuthenticated, async (req, res) => {
  const { stepId } = req.params;
  const { clearTime } = req.body;

  try {
    const step = await prisma.steps.update({
      where: {
        id: parseInt(stepId),
        authorId: req.userId,
      },
      data: {
        clearTime: clearTime,
      },
    });
    res.status(200).json(step);
  } catch (e) {
    res.status(500).json({ error: "サーバーエラー" });
  }
});

router.delete("/step_delete/:stepId", isAuthenticated, async (req, res) => {
  try {
    delData = await prisma.steps.delete({
      where: {
        id: parseInt(req.params.stepId),
        authorId: req.userId,
      },
    });
    res.status(200).json(delData);
  } catch (e) {
    res.status(500).json({ error: "サーバーエラー" });
  }
});

router.get("/steps_list", isAuthenticated, async (req, res) => {
  try {
    const steps = await prisma.steps.findMany({
      where: {
        authorId: req.userId,
        clearTime: "2000-01-01T00:00:00.000Z",
      },
      orderBy: {
        deadLine: "asc",
      },
      take: 3,
    });
    res.status(200).json(steps);
  } catch (e) {
    console.log("User ID:", req.userId);
    console.log(e);
    res.status(500).json({ message: e });
  }
});

module.exports = router; //routerをエクスポート
