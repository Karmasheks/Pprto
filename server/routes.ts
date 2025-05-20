import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertUserSchema } from "@shared/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Session setup
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your_session_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 1 day
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );
  
  // Auth middleware
  const authenticate = (req: Request, res: Response, next: Function) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
  
  // Require role middleware
  const requireRole = (roles: string[]) => {
    return (req: Request, res: Response, next: Function) => {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }
      
      next();
    };
  };
  
  // AUTH ROUTES
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Create activity for user registration
      await storage.createActivity({
        userId: user.id,
        action: "User registered",
        timestamp: new Date(),
        resourceType: "user",
        resourceId: user.id,
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      
      // Return user without password and token
      const { password, ...userWithoutPassword } = user;
      return res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      
      // Create login activity
      await storage.createActivity({
        userId: user.id,
        action: "User logged in",
        timestamp: new Date(),
        resourceType: "user",
        resourceId: user.id,
      });
      
      // Return user without password and token
      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });
  
  app.get("/api/auth/me", authenticate, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  // USER ROUTES
  app.get("/api/users", authenticate, requireRole(["admin", "marketing_manager"]), async (_, res) => {
    try {
      const users = await Promise.all(
        Array.from({ length: 5 }, async (_, i) => {
          const userId = i + 1;
          const user = {
            id: userId,
            name: ["Jane Doe", "Mike Smith", "Anna Roberts", "Alex Morgan", "John White"][i],
            email: [`user${userId}@example.com`],
            role: ["marketing_manager", "content_creator", "content_creator", "admin", "marketing_manager"][i],
            avatar: ["JD", "MS", "AR", "AM", "JW"][i],
          };
          
          // Get metrics for user
          const metrics = await storage.getMetricByUserId(userId) || {
            tasksCompleted: Math.floor(Math.random() * 30) + 10,
            tasksTotal: Math.floor(Math.random() * 10) + 30,
            onTimeRate: Math.floor(Math.random() * 20) + 75,
            productivityScore: Math.floor(Math.random() * 30) + 70,
          };
          
          return {
            ...user,
            metrics,
          };
        })
      );
      
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  // ROLE ROUTES
  app.get("/api/roles", authenticate, requireRole(["admin"]), async (_, res) => {
    try {
      const roles = await storage.getAllRoles();
      return res.status(200).json(roles);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/roles", authenticate, requireRole(["admin"]), async (req, res) => {
    try {
      const role = await storage.createRole(req.body);
      
      // Create activity
      await storage.createActivity({
        userId: req.user.id,
        action: "Created role",
        timestamp: new Date(),
        resourceType: "role",
        resourceId: role.id,
      });
      
      return res.status(201).json(role);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  app.put("/api/roles/:id", authenticate, requireRole(["admin"]), async (req, res) => {
    try {
      const roleId = parseInt(req.params.id);
      const updatedRole = await storage.updateRole(roleId, req.body);
      
      if (!updatedRole) {
        return res.status(404).json({ message: "Role not found" });
      }
      
      // Create activity
      await storage.createActivity({
        userId: req.user.id,
        action: "Updated role",
        timestamp: new Date(),
        resourceType: "role",
        resourceId: roleId,
      });
      
      return res.status(200).json(updatedRole);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  // CAMPAIGN ROUTES
  app.get("/api/campaigns", authenticate, async (_, res) => {
    try {
      const campaigns = await storage.getAllCampaigns();
      return res.status(200).json(campaigns);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/campaigns", authenticate, requireRole(["admin", "marketing_manager"]), async (req, res) => {
    try {
      const campaign = await storage.createCampaign(req.body);
      
      // Create activity
      await storage.createActivity({
        userId: req.user.id,
        action: "Created campaign",
        timestamp: new Date(),
        resourceType: "campaign",
        resourceId: campaign.id,
      });
      
      return res.status(201).json(campaign);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  app.put("/api/campaigns/:id", authenticate, requireRole(["admin", "marketing_manager"]), async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const updatedCampaign = await storage.updateCampaign(campaignId, req.body);
      
      if (!updatedCampaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Create activity
      await storage.createActivity({
        userId: req.user.id,
        action: "Updated campaign",
        timestamp: new Date(),
        resourceType: "campaign",
        resourceId: campaignId,
      });
      
      return res.status(200).json(updatedCampaign);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  // TASK ROUTES
  app.get("/api/tasks", authenticate, async (req, res) => {
    try {
      let tasks;
      
      if (req.query.userId) {
        tasks = await storage.getTasksByUserId(parseInt(req.query.userId as string));
      } else if (req.query.campaignId) {
        tasks = await storage.getTasksByCampaignId(parseInt(req.query.campaignId as string));
      } else {
        tasks = await storage.getAllTasks();
      }
      
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  app.post("/api/tasks", authenticate, async (req, res) => {
    try {
      const task = await storage.createTask(req.body);
      
      // Create activity
      await storage.createActivity({
        userId: req.user.id,
        action: "Created task",
        timestamp: new Date(),
        resourceType: "task",
        resourceId: task.id,
      });
      
      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  app.put("/api/tasks/:id", authenticate, async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);
      
      // Check if user is authorized to update the task
      if (task && task.userId !== req.user.id && req.user.role !== "admin" && req.user.role !== "marketing_manager") {
        return res.status(403).json({ message: "Not authorized to update this task" });
      }
      
      const updatedTask = await storage.updateTask(taskId, req.body);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      
      // Create activity
      await storage.createActivity({
        userId: req.user.id,
        action: `Updated task ${req.body.status === "completed" ? "to completed" : ""}`,
        timestamp: new Date(),
        resourceType: "task",
        resourceId: taskId,
      });
      
      return res.status(200).json(updatedTask);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  // METRICS ROUTES
  app.get("/api/metrics", authenticate, requireRole(["admin", "marketing_manager"]), async (_, res) => {
    try {
      const metrics = await storage.getAllMetrics();
      return res.status(200).json(metrics);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  app.get("/api/metrics/:userId", authenticate, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Only admins, marketing managers, or the user themselves can view their metrics
      if (req.user.id !== userId && req.user.role !== "admin" && req.user.role !== "marketing_manager") {
        return res.status(403).json({ message: "Not authorized to view these metrics" });
      }
      
      const metrics = await storage.getMetricByUserId(userId);
      
      if (!metrics) {
        return res.status(404).json({ message: "Metrics not found for this user" });
      }
      
      return res.status(200).json(metrics);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  // ACTIVITY ROUTES
  app.get("/api/activities", authenticate, async (req, res) => {
    try {
      let activities;
      
      if (req.query.userId) {
        const userId = parseInt(req.query.userId as string);
        
        // Only admins, marketing managers, or the user themselves can view their activities
        if (req.user.id !== userId && req.user.role !== "admin" && req.user.role !== "marketing_manager") {
          return res.status(403).json({ message: "Not authorized to view these activities" });
        }
        
        activities = await storage.getActivitiesByUserId(userId);
      } else if (req.user.role === "admin" || req.user.role === "marketing_manager") {
        activities = await storage.getAllActivities();
      } else {
        activities = await storage.getActivitiesByUserId(req.user.id);
      }
      
      return res.status(200).json(activities);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });

  // DASHBOARD DATA
  app.get("/api/dashboard", authenticate, async (req, res) => {
    try {
      // Get campaigns
      const campaigns = await storage.getAllCampaigns();
      
      // Get user metrics (for team performance)
      const metrics = await storage.getAllMetrics();
      
      // Get recent activities
      const activities = await storage.getAllActivities();
      
      // Get roles
      const roles = await storage.getAllRoles();
      
      // Generate sample performance data (would be calculated from real metrics in a production app)
      const performanceData = {
        campaigns: campaigns.length,
        campaignsChange: 8,
        openTasks: 42,
        openTasksChange: 12,
        conversionRate: 3.2,
        conversionRateChange: 0.8,
        teamProductivity: 87,
        teamProductivityChange: 5,
        teamMembers: [
          {
            id: 1,
            name: "Jane Doe",
            email: "jane.doe@example.com",
            role: "Marketing Manager",
            tasksCompleted: 24,
            tasksTotal: 30,
            onTimeRate: 92,
            productivityScore: 90,
            avatar: "JD"
          },
          {
            id: 2,
            name: "Mike Smith",
            email: "mike.smith@example.com",
            role: "Content Creator",
            tasksCompleted: 18,
            tasksTotal: 25,
            onTimeRate: 78,
            productivityScore: 72,
            avatar: "MS"
          },
          {
            id: 3,
            name: "Anna Roberts",
            email: "anna.roberts@example.com",
            role: "Social Media Specialist",
            tasksCompleted: 32,
            tasksTotal: 35,
            onTimeRate: 94,
            productivityScore: 95,
            avatar: "AR"
          }
        ]
      };
      
      return res.status(200).json({
        campaigns,
        metrics,
        activities: activities.slice(0, 10), // Latest 10 activities
        roles,
        performanceData
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  return httpServer;
}
