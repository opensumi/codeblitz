const commentData = [
  ['02699cd6ca65aa6819d7e387678d8ea5359b5e59_0_56', new Set([8])],
  ['c17950853d6b9677e9822cf07f2616db7ca02797_49_48', new Set([9])],
  ['02699cd6ca65aa6819d7e387678d8ea5359b5e59_0_95', new Set([12])],
  ['02699cd6ca65aa6819d7e387678d8ea5359b5e59_0_9', new Set([11])],
];

export const lineToNoteIdSet = commentData.reduce((prev, [line_number, id_set]) => {
  prev.set(line_number, id_set);
  return prev;
}, new Map());

const _noteIdToNote = new Map();

_noteIdToNote.set(1, {
  author: {
    avatarUrl: 'https://via.placeholder.com/300/09f.png',
    email: 'test@test.com',
    externUid: '146194',
    id: 15165,
    name: '大黄蜂',
    state: 'active',
    username: 'taian.lta',
    webUrl: 'https://taobao.com',
  },
  commitId: null,
  createdAt: '2020-08-11T20:56:08+0800',
  discussionId: null,
  id: 9,
  isAward: false,
  labels: [],
  latestStDiff: {
    aMode: '100644',
    addLineNum: 265,
    bMode: '100644',
    binaryFile: false,
    charsetName: 'UTF-8',
    delLineNum: 265,
    deletedFile: false,
    diff:
      '@@ -27,30 +27,30 @@ export const getLogin = (req: Request, res: Response) => {\n  * Sign in using email and password.\n  */\n export const postLogin = async (req: Request, res: Response, next: NextFunction) => {\n-    await check("email", "Email is not valid").isEmail().run(req);\n-    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);\n-    // eslint-disable-next-line @typescript-eslint/camelcase\n-    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);\n-\n-    const errors = validationResult(req);\n-\n-    if (!errors.isEmpty()) {\n-        req.flash("errors", errors.array());\n-        return res.redirect("/login");\n+  await check("email", "Email is not valid").isEmail().run(req);\n+  await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);\n+  // eslint-disable-next-line @typescript-eslint/camelcase\n+  await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);\n+\n+  const errors = validationResult(req);\n+\n+  if (!errors.isEmpty()) {\n+    req.flash("errors", errors.array());\n+    return res.redirect("/login");\n+  }\n+\n+  passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {\n+    if (err) { return next(err); }\n+    if (!user) {\n+      req.flash("errors", { msg: info.message });\n+      return res.redirect("/login");\n     }\n-\n-    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {\n-        if (err) { return next(err); }\n-        if (!user) {\n-            req.flash("errors", {msg: info.message});\n-            return res.redirect("/login");\n-        }\n-        req.logIn(user, (err) => {\n-            if (err) { return next(err); }\n-            req.flash("success", { msg: "Success! You are logged in." });\n-            res.redirect(req.session.returnTo || "/");\n-        });\n-    })(req, res, next);\n+    req.logIn(user, (err) => {\n',
    id: 34,
    newFile: false,
    newPath: 'src/controllers/user.ts',
    oldPath: 'src/controllers/user.ts',
    renamedFile: false,
    tooLarge: false,
  },
  lineCode: 'c17950853d6b9677e9822cf07f2616db7ca02797_49_48',
  lineType: 'old',
  note: '@hello.world(你好) 测试一下咔咔咔咔咔咔',
  noteableId: 1530,
  noteableType: 'ReviewComment',
  outdated: false,
  path: 'src/controllers/user.ts',
  resolvedAt: null,
  resolvedBy: null,
  stDiff: {
    aMode: '100644',
    addLineNum: 265,
    bMode: '100644',
    binaryFile: false,
    charsetName: 'UTF-8',
    delLineNum: 265,
    deletedFile: false,
    diff:
      '@@ -27,30 +27,30 @@ export const getLogin = (req: Request, res: Response) => {\n  * Sign in using email and password.\n  */\n export const postLogin = async (req: Request, res: Response, next: NextFunction) => {\n-    await check("email", "Email is not valid").isEmail().run(req);\n-    await check("password", "Password cannot be blank").isLength({min: 1}).run(req);\n-    // eslint-disable-next-line @typescript-eslint/camelcase\n-    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);\n-\n-    const errors = validationResult(req);\n-\n-    if (!errors.isEmpty()) {\n-        req.flash("errors", errors.array());\n-        return res.redirect("/login");\n+  await check("email", "Email is not valid").isEmail().run(req);\n+  await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);\n+  // eslint-disable-next-line @typescript-eslint/camelcase\n+  await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);\n+\n+  const errors = validationResult(req);\n+\n+  if (!errors.isEmpty()) {\n+    req.flash("errors", errors.array());\n+    return res.redirect("/login");\n+  }\n+\n+  passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {\n+    if (err) { return next(err); }\n+    if (!user) {\n+      req.flash("errors", { msg: info.message });\n+      return res.redirect("/login");\n     }\n-\n-    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {\n-        if (err) { return next(err); }\n-        if (!user) {\n-            req.flash("errors", {msg: info.message});\n-            return res.redirect("/login");\n-        }\n-        req.logIn(user, (err) => {\n-            if (err) { return next(err); }\n-            req.flash("success", { msg: "Success! You are logged in." });\n-            res.redirect(req.session.returnTo || "/");\n-        });\n-    })(req, res, next);\n+    req.logIn(user, (err) => {\n',
    id: 45,
    newFile: false,
    newPath: 'src/controllers/user.ts',
    oldPath: 'src/controllers/user.ts',
    renamedFile: false,
    tooLarge: false,
  },
  state: null,
  system: false,
  type: 'Comment',
  updatedAt: '2020-08-18T12:09:55+0800',
});

export const noteIdToNote = _noteIdToNote;
