import { Router } from "express";
import { deleteUser, getUser, getUserById, insertUser, login, updateStatus, updateUser } from "../../controllers/Auth/auth";
import { deleteValidator, loginValidator, userInsertValidator, userStatusValidator, userUpdateValidator } from "../../utils/validations";
import { verifyJWT } from "../../middleware/verifyJWT";

const router = Router();

router.post("/login", loginValidator, login);
router.post("/user/insert", verifyJWT, userInsertValidator, insertUser);
router.post("/user/update", verifyJWT, userUpdateValidator, updateUser);
router.post("/user/status", verifyJWT, userStatusValidator, updateStatus);
router.post("/user/get", verifyJWT, getUser);
router.post("/user", verifyJWT, getUserById);
router.post("/user/delete", verifyJWT, deleteValidator, deleteUser);

export default router;