import express, { type Request, type Response, type NextFunction } from "express"
import mongoose from "mongoose"
import cors from "cors"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User, { type IUser } from "./models/User"

// Load environment variables first
dotenv.config()

// console.log("🚀 Starting server...")
// console.log("Environment variables loaded:")
// console.log("- PORT:", process.env.PORT)
// console.log("- CLIENT_URL:", process.env.CLIENT_URL)
// console.log("- MONGO_URI:", process.env.MONGO_URI ? "✅ Set" : "❌ Missing")
// console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Missing")

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(express.json())

// Add request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Connect to MongoDB
console.log("🔌 Connecting to MongoDB...")
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully")
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1)
  })

// Types
interface AuthRequest extends Request {
  user?: IUser
}

interface LoginRequest {
  email: string
  password: string
}

interface SignupRequest {
  username: string
  email: string
  password: string
}

// JWT Middleware
const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" })
  }
}

// Health check route
app.get("/", (req: Request, res: Response) => {
  console.log("📍 Health check endpoint hit")
  res.json({
    message: "MERN Todo API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Signup Route
app.post("/signup", async (req: Request<{}, {}, SignupRequest>, res: Response) => {
  console.log("📝 Signup attempt:", { ...req.body, password: "[HIDDEN]" })

  try {
    const { username, email, password } = req.body

    // Validation
    if (!username || !email || !password) {
      console.log("❌ Validation failed: Missing fields")
      return res.status(400).json({ message: "All fields are required" })
    }

    if (password.length < 6) {
      console.log("❌ Validation failed: Password too short")
      return res.status(400).json({ message: "Password must be at least 6 characters" })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.log("❌ Validation failed: Invalid email format")
      return res.status(400).json({ message: "Please enter a valid email" })
    }

    // Username validation
    if (username.length < 3 || username.length > 20) {
      console.log("❌ Validation failed: Invalid username length")
      return res.status(400).json({ message: "Username must be between 3 and 20 characters" })
    }

    console.log("🔍 Checking for existing user...")
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      console.log("❌ User already exists:", existingUser.email === email ? "email" : "username")
      return res.status(400).json({
        message: existingUser.email === email ? "Email already exists" : "Username already exists",
      })
    }

    console.log("👤 Creating new user...")
    // Create new user
    const user = new User({ username, email, password })
    await user.save()
    console.log("✅ User created successfully:", user._id)

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" })
    console.log("🔑 JWT token generated")

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("❌ Signup error:", error)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return res.status(400).json({ message: "Email or username already exists" })
    }
    res.status(500).json({ message: "Server error during signup" })
  }
})

// Login Route
app.post("/login", async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  console.log("🔐 Login attempt:", { email: req.body.email, password: "[HIDDEN]" })

  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      console.log("❌ Validation failed: Missing credentials")
      return res.status(400).json({ message: "Email and password are required" })
    }

    console.log("🔍 Finding user...")
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      console.log("❌ User not found")
      return res.status(400).json({ message: "Invalid credentials" })
    }

    console.log("🔒 Checking password...")
    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      console.log("❌ Invalid password")
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" })
    console.log("✅ Login successful for user:", user.username)

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("❌ Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Protected route to verify token
app.get("/verify", authenticateToken, async (req: AuthRequest, res: Response) => {
  console.log("🔍 Token verification for user:", req.user!.username)
  res.json({
    message: "Token is valid",
    user: {
      id: req.user!._id,
      username: req.user!.username,
      email: req.user!.email,
    },
  })
})

// Simple todos route (just for testing auth)
app.get("/todos", authenticateToken, async (req: AuthRequest, res: Response) => {
  console.log("📋 Todos accessed by user:", req.user!.username)
  res.json({
    message: `Welcome to todos, ${req.user!.username}!`,
    user: req.user!.username,
  })
})

// Error handling middleware
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("💥 Unhandled error:", error)
  res.status(500).json({ message: "Internal server error" })
})

// 404 handler
app.use("*", (req: Request, res: Response) => {
  console.log("❓ 404 - Route not found:", req.method, req.originalUrl)
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}`)
  console.log(`🔗 CORS enabled for: ${process.env.CLIENT_URL || "http://localhost:5173"}`)
})

// Handle process termination
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("👋 SIGINT received, shutting down gracefully")
  process.exit(0)
})
