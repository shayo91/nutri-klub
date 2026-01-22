import { Router } from "express";
import { db } from "../db";
import { users, userPreferences } from "@shared/schema-sqlite";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateTokens, verifyToken } from "../utils/jwt";
import { authenticate } from "../middleware/auth";
import { z } from "zod";

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  referralCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * POST /api/auth/register - Register a new user
 */
router.post("/register", async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, firstName, lastName, referralCode } = validatedData;

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate unique referral code for this user
    const newReferralCode = `REF${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Check if referred by someone
    let referredByUserId: number | null = null;
    if (referralCode) {
      const [referrer] = await db
        .select()
        .from(users)
        .where(eq(users.referralCode, referralCode))
        .limit(1);

      if (referrer) {
        referredByUserId = referrer.id;
      }
    }

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName: firstName || null,
        lastName: lastName || null,
        role: "free",
        subscriptionStatus: "inactive",
        referralCode: newReferralCode,
        referredBy: referredByUserId,
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    // Create default user preferences
    await db.insert(userPreferences).values({
      userId: newUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Return user info (without password)
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      user: userWithoutPassword,
      accessToken, // Also return token for clients that prefer headers
      message: "Registration successful",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

/**
 * POST /api/auth/login - Login user
 */
router.post("/login", async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Update last login
    await db
      .update(users)
      .set({
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, user.id));

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Return user info
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      accessToken,
      message: "Login successful",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

/**
 * POST /api/auth/logout - Logout user
 */
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logout successful" });
});

/**
 * GET /api/auth/me - Get current user
 */
router.get("/me", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user information" });
  }
});

/**
 * POST /api/auth/refresh - Refresh access token
 */
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    const payload = verifyToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate new tokens
    const tokens = generateTokens(user);

    // Set new cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: tokens.accessToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

/**
 * POST /api/auth/forgot-password - Request password reset
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const validatedData = forgotPasswordSchema.parse(req.body);
    const { email } = validatedData;

    // Check if user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // TODO: Implement password reset email sending
    // For now, just return success
    res.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to process password reset request" });
  }
});

/**
 * POST /api/auth/reset-password - Reset password with token
 */
router.post("/reset-password", async (req, res) => {
  try {
    // TODO: Implement password reset with token verification
    res.status(501).json({ error: "Password reset not yet implemented" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

/**
 * PATCH /api/auth/profile - Update user profile
 */
router.patch("/profile", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const updateSchema = z.object({
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
    });

    const validatedData = updateSchema.parse(req.body);

    if (Object.keys(validatedData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        ...validatedData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, req.user.userId))
      .returning();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

/**
 * POST /api/auth/change-password - Change user password
 */
router.post("/change-password", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const changePasswordSchema = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(8, "New password must be at least 8 characters"),
    });

    const validatedData = changePasswordSchema.parse(req.body);
    const { currentPassword, newPassword } = validatedData;

    // Get current user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has a password hash
    if (!user.passwordHash || user.passwordHash.trim() === '') {
      return res.status(400).json({ error: "Password not set for this account" });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    
    if (!isValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, req.user.userId));

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

export default router;
