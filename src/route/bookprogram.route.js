// bookprogram.route.js
import express from "express";

import { authenticate } from "../middlewares/auth.js";
import { createBookProgram, deleteBookProgram, getBookProgramById, getBookPrograms, updateBookProgram } from "../controller/bookProgram.controller.js";

const router = express.Router();

/**
 * Public route to create a booking OR authenticated users
 * POST /api/bookprograms
 */
router.post("/", authenticate, createBookProgram);

/**
 * GET list of bookings
 * GET /api/bookprograms
 * - Admin can list all
 * - Musicians can list their own (protect middleware sets req.user)
 */
router.get("/", authenticate, getBookPrograms);

/**
 * GET single booking
 * GET /api/bookprograms/:id
 */
router.get("/:id", authenticate, getBookProgramById);

/**
 * PATCH update booking
 * PATCH /api/bookprograms/:id
 */
router.patch("/:id", authenticate, updateBookProgram);

/**
 * DELETE booking
 * DELETE /api/bookprograms/:id
 */
router.delete("/:id", authenticate, deleteBookProgram);

export default router;
