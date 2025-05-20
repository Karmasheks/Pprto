import { 
  users, 
  roles, 
  campaigns, 
  tasks, 
  metrics, 
  activities,
  type User, 
  type InsertUser, 
  type Role, 
  type InsertRole, 
  type Campaign, 
  type InsertCampaign, 
  type Task, 
  type InsertTask, 
  type Metric, 
  type InsertMetric, 
  type Activity, 
  type InsertActivity 
} from "@shared/schema";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Role operations
  getRole(id: number): Promise<Role | undefined>;
  getRoleByName(name: string): Promise<Role | undefined>;
  getAllRoles(): Promise<Role[]>;
  createRole(role: InsertRole): Promise<Role>;
  updateRole(id: number, role: Partial<InsertRole>): Promise<Role | undefined>;
  deleteRole(id: number): Promise<boolean>;
  
  // Campaign operations
  getCampaign(id: number): Promise<Campaign | undefined>;
  getAllCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getAllTasks(): Promise<Task[]>;
  getTasksByUserId(userId: number): Promise<Task[]>;
  getTasksByCampaignId(campaignId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Metric operations
  getMetric(id: number): Promise<Metric | undefined>;
  getMetricByUserId(userId: number): Promise<Metric | undefined>;
  getAllMetrics(): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  updateMetric(id: number, metric: Partial<InsertMetric>): Promise<Metric | undefined>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getAllActivities(): Promise<Activity[]>;
  getActivitiesByUserId(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private roles: Map<number, Role>;
  private campaigns: Map<number, Campaign>;
  private tasks: Map<number, Task>;
  private metrics: Map<number, Metric>;
  private activities: Map<number, Activity>;
  
  // Current IDs for auto-increment
  private userId: number;
  private roleId: number;
  private campaignId: number;
  private taskId: number;
  private metricId: number;
  private activityId: number;
  
  constructor() {
    this.users = new Map();
    this.roles = new Map();
    this.campaigns = new Map();
    this.tasks = new Map();
    this.metrics = new Map();
    this.activities = new Map();
    
    this.userId = 1;
    this.roleId = 1;
    this.campaignId = 1;
    this.taskId = 1;
    this.metricId = 1;
    this.activityId = 1;
    
    // Seed initial data
    this.seedInitialData();
  }
  
  private seedInitialData() {
    // Create roles
    const adminRole: InsertRole = {
      name: "Administrator",
      description: "Full access to all features",
      permissions: ["dashboard", "tasks", "team", "reports", "settings"],
    };
    
    const marketingManagerRole: InsertRole = {
      name: "Marketing Manager",
      description: "Can manage campaigns and view reports",
      permissions: ["dashboard", "tasks", "team", "reports"],
    };
    
    const contentCreatorRole: InsertRole = {
      name: "Content Creator",
      description: "Creates and edits content for campaigns",
      permissions: ["dashboard", "tasks"],
    };
    
    this.createRole(adminRole);
    this.createRole(marketingManagerRole);
    this.createRole(contentCreatorRole);
    
    // Create admin user
    const adminPassword = bcrypt.hashSync("admin123", 10);
    this.createUser({
      name: "Alex Morgan",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
      avatar: "AM",
    });
    
    // Create campaign data
    this.createCampaign({
      name: "Summer Promotion",
      progress: 87,
      startDate: new Date("2023-06-01"),
      endDate: new Date("2023-09-30"),
      status: "active",
    });
    
    this.createCampaign({
      name: "Product Launch",
      progress: 65,
      startDate: new Date("2023-08-15"),
      endDate: new Date("2023-10-15"),
      status: "active",
    });
    
    this.createCampaign({
      name: "Q3 Newsletter",
      progress: 32,
      startDate: new Date("2023-07-01"),
      endDate: new Date("2023-09-30"),
      status: "active",
    });
    
    this.createCampaign({
      name: "Social Media",
      progress: 94,
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      status: "active",
    });
  }
  
  // USER OPERATIONS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    
    if (!user.avatar && user.name) {
      // Create avatar initials from name
      user.avatar = user.name
        .split(" ")
        .map(part => part.charAt(0))
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    
    this.users.set(id, user);
    
    // Create initial metrics for the user
    this.createMetric({
      userId: id,
      tasksCompleted: 0,
      tasksTotal: 0,
      onTimeRate: 0,
      productivityScore: 0,
    });
    
    return user;
  }
  
  // ROLE OPERATIONS
  async getRole(id: number): Promise<Role | undefined> {
    return this.roles.get(id);
  }
  
  async getRoleByName(name: string): Promise<Role | undefined> {
    for (const role of this.roles.values()) {
      if (role.name === name) {
        return role;
      }
    }
    return undefined;
  }
  
  async getAllRoles(): Promise<Role[]> {
    return Array.from(this.roles.values());
  }
  
  async createRole(insertRole: InsertRole): Promise<Role> {
    const id = this.roleId++;
    const role: Role = { ...insertRole, id };
    this.roles.set(id, role);
    return role;
  }
  
  async updateRole(id: number, role: Partial<InsertRole>): Promise<Role | undefined> {
    const existingRole = this.roles.get(id);
    if (!existingRole) {
      return undefined;
    }
    
    const updatedRole = { ...existingRole, ...role };
    this.roles.set(id, updatedRole);
    return updatedRole;
  }
  
  async deleteRole(id: number): Promise<boolean> {
    return this.roles.delete(id);
  }
  
  // CAMPAIGN OPERATIONS
  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }
  
  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }
  
  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.campaignId++;
    const campaign: Campaign = { ...insertCampaign, id };
    this.campaigns.set(id, campaign);
    return campaign;
  }
  
  async updateCampaign(id: number, campaign: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const existingCampaign = this.campaigns.get(id);
    if (!existingCampaign) {
      return undefined;
    }
    
    const updatedCampaign = { ...existingCampaign, ...campaign };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }
  
  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }
  
  // TASK OPERATIONS
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }
  
  async getTasksByUserId(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }
  
  async getTasksByCampaignId(campaignId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.campaignId === campaignId);
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskId++;
    const task: Task = { ...insertTask, id };
    this.tasks.set(id, task);
    
    // Update user metrics
    const metric = await this.getMetricByUserId(insertTask.userId);
    if (metric) {
      await this.updateMetric(metric.id, {
        tasksTotal: metric.tasksTotal + 1,
      });
    }
    
    return task;
  }
  
  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      return undefined;
    }
    
    const updatedTask = { ...existingTask, ...task };
    this.tasks.set(id, updatedTask);
    
    // If task status changed to completed, update metrics
    if (task.status === "completed" && existingTask.status !== "completed") {
      const metric = await this.getMetricByUserId(existingTask.userId);
      if (metric) {
        await this.updateMetric(metric.id, {
          tasksCompleted: metric.tasksCompleted + 1,
        });
      }
    }
    
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  // METRIC OPERATIONS
  async getMetric(id: number): Promise<Metric | undefined> {
    return this.metrics.get(id);
  }
  
  async getMetricByUserId(userId: number): Promise<Metric | undefined> {
    for (const metric of this.metrics.values()) {
      if (metric.userId === userId) {
        return metric;
      }
    }
    return undefined;
  }
  
  async getAllMetrics(): Promise<Metric[]> {
    return Array.from(this.metrics.values());
  }
  
  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = this.metricId++;
    const metric: Metric = { ...insertMetric, id };
    this.metrics.set(id, metric);
    return metric;
  }
  
  async updateMetric(id: number, metric: Partial<InsertMetric>): Promise<Metric | undefined> {
    const existingMetric = this.metrics.get(id);
    if (!existingMetric) {
      return undefined;
    }
    
    const updatedMetric = { ...existingMetric, ...metric };
    
    // Calculate productivity score based on task completion rate and on-time rate
    // Only if these values changed
    if (
      (metric.tasksCompleted !== undefined || metric.tasksTotal !== undefined) &&
      updatedMetric.tasksTotal > 0
    ) {
      const completionRate = (updatedMetric.tasksCompleted / updatedMetric.tasksTotal) * 100;
      const onTimeRate = updatedMetric.onTimeRate;
      const productivityScore = Math.round((completionRate + onTimeRate) / 2);
      
      updatedMetric.productivityScore = productivityScore;
    }
    
    this.metrics.set(id, updatedMetric);
    return updatedMetric;
  }
  
  // ACTIVITY OPERATIONS
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async getAllActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityId++;
    const activity: Activity = { ...insertActivity, id };
    
    // Set timestamp to now if not provided
    if (!activity.timestamp) {
      activity.timestamp = new Date();
    }
    
    this.activities.set(id, activity);
    return activity;
  }
}

export const storage = new MemStorage();
