// ============================================================
// Shared TypeScript Types & Interfaces
// ============================================================

export type ThemeMode = 'light' | 'dark' | 'system';

// ── User & Auth ──────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    createdAt: string;
    plan: PlanType;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
    plan?: PlanType;
    acceptTerms: boolean;
}

// ── Plans & Billing ──────────────────────────────────────────
export type PlanType = 'free' | 'pro' | 'team' | 'enterprise';

export interface Plan {
    id: PlanType;
    name: string;
    price: number;
    period: 'month' | 'year';
    features: string[];
    highlighted?: boolean;
}

// ── Projects ─────────────────────────────────────────────────
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    progress: number; // 0–100
    ownerId: string;
    teamIds: string[];
    dueDate: string;
    createdAt: string;
    tags: string[];
    color: string;
}

// ── Tasks ─────────────────────────────────────────────────────
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    projectId: string;
    assigneeId?: string;
    dueDate?: string;
    createdAt: string;
    tags: string[];
    estimatedHours?: number;
}

// ── Team ─────────────────────────────────────────────────────
export interface TeamMember {
    id: string;
    userId: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: User['role'];
    joinedAt: string;
    lastActive: string;
    tasksCount: number;
}

// ── Stats & Analytics ─────────────────────────────────────────
export interface StatCardData {
    id: string;
    label: string;
    value: number | string;
    change: number; // percentage delta
    trend: 'up' | 'down' | 'neutral';
    icon: string;
    color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
}

// ── Activity Feed ─────────────────────────────────────────────
export type ActivityType =
    | 'task_created'
    | 'task_completed'
    | 'project_created'
    | 'member_joined'
    | 'comment_added'
    | 'file_uploaded';

export interface Activity {
    id: string;
    type: ActivityType;
    userId: string;
    userName: string;
    userAvatar?: string;
    message: string;
    resourceId?: string;
    resourceName?: string;
    createdAt: string;
}

// ── Notifications ─────────────────────────────────────────────
export interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
    createdAt: string;
}

// ── API Responses ─────────────────────────────────────────────
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// ── UI Helpers ────────────────────────────────────────────────
export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface NavItem {
    href: string;
    label: string;
    icon: string;
    badge?: number;
    children?: NavItem[];
}
